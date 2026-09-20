import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous.service';
import { ConsultationService } from '../../services/consultation.service';
import { PrescriptionService } from '../../services/prescription.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { RendezVousResDTO } from '../../models/rendez-vous.model';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';

@Component({
  selector: 'app-tableau-de-bord-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tableau-de-bord-patient.component.html',
  styleUrl: './tableau-de-bord-patient.component.css',
})
export class TableauDeBordPatient implements OnInit, OnDestroy {
  idPatient: number;
  rendezVousList: RendezVousResDTO[] = [];
  dernieresConsultations: ConsultationResDTO[] = [];
  prescriptions: PrescriptionResDTO[] = [];
  chargement = false;
  messageNotification = '';
  messageErreur = '';
  intervalId: any;

  // Report de rendez-vous
  rdvAReporter: RendezVousResDTO | null = null;
  nouvelleDate = '';
  nouvelleHeure = '';
  reportEnCours = false;

  constructor(
    private rdvService: RendezVousService,
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {
    this.idPatient = this.contexte.idPatient;
  }

  ngOnInit(): void {
    this.chargement = true;
    this.chargerDonnees();
    this.intervalId = setInterval(() => {
      this.chargerDonnees();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  chargerDonnees(): void {
    this.rdvService.getTous(0, 10, 'dateSouhaitee', { idPatient: this.idPatient }).subscribe({
      next: (res) => {
        this.rendezVousList = res?.content ?? [];
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement RDV:', err);
        this.rendezVousList = [];
        this.chargement = false;
        this.cdr.markForCheck();
      }
    });

    this.consultationService.getTous(0, 5, 'dateConsultation', { idPatient: this.idPatient }).subscribe({
      next: (res) => {
        this.dernieresConsultations = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.dernieresConsultations = [];
        this.cdr.markForCheck();
      }
    });

    this.prescriptionService.getTous(0, 5, 'dateEmission', { idPatient: this.idPatient }).subscribe({
      next: (res) => {
        this.prescriptions = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement prescriptions:', err);
        this.prescriptions = [];
        this.cdr.markForCheck();
      }
    });
  }

  /** Rendez-vous à venir (ni annulés ni déjà honorés). */
  get prochainsRdv(): RendezVousResDTO[] {
    return this.rendezVousList.filter(r => r.statut === 'EN_ATTENTE' || r.statut === 'CONFIRME');
  }

  get prochainRdv(): RendezVousResDTO | null {
    return this.prochainsRdv.length > 0 ? this.prochainsRdv[0] : null;
  }

  private notifier(message: string): void {
    this.messageNotification = message;
    this.messageErreur = '';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.messageNotification = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  private notifierErreur(err: any, defaut: string): void {
    this.messageErreur = err?.error?.message || defaut;
    this.messageNotification = '';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.messageErreur = '';
      this.cdr.markForCheck();
    }, 5000);
  }

  annulerRdv(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.rdvService.annuler(id).subscribe({
        next: () => {
          this.notifier('Rendez-vous annulé.');
          this.chargerDonnees();
        },
        error: (err) => this.notifierErreur(err, 'Erreur lors de l\'annulation du rendez-vous.')
      });
    }
  }

  ouvrirReport(rdv: RendezVousResDTO): void {
    this.rdvAReporter = rdv;
    this.nouvelleDate = rdv.dateSouhaitee;
    this.nouvelleHeure = rdv.heureSouhaitee.substring(0, 5);
  }

  fermerReport(): void {
    this.rdvAReporter = null;
  }

  confirmerReport(): void {
    if (!this.rdvAReporter || !this.nouvelleDate || !this.nouvelleHeure) return;
    this.reportEnCours = true;
    this.rdvService.reporter(this.rdvAReporter.idRendezVous, {
      nouvelleDateSouhaitee: this.nouvelleDate,
      nouvelleHeureSouhaitee: this.nouvelleHeure.length === 5 ? `${this.nouvelleHeure}:00` : this.nouvelleHeure
    }).subscribe({
      next: () => {
        this.reportEnCours = false;
        this.rdvAReporter = null;
        this.notifier('Rendez-vous reporté. Il repasse en attente de confirmation.');
        this.chargerDonnees();
      },
      error: (err) => {
        this.reportEnCours = false;
        this.notifierErreur(err, 'Erreur lors du report du rendez-vous.');
      }
    });
  }

  telechargerPdfConsultation(idConsultation: number): void {
    this.consultationService.genererPdf(idConsultation).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_${idConsultation}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notifierErreur(err, 'Erreur lors du téléchargement du PDF.')
    });
  }
}

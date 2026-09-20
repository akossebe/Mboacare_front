import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous.service';
import { ConsultationService } from '../../services/consultation.service';
import { PrescriptionService } from '../../services/prescription.service';
import { StatistiquesService } from '../../services/stats.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { RendezVousResDTO } from '../../models/rendez-vous.model';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';
import { MedecinStatsDTO } from '../../models/stats.model';

@Component({
  selector: 'app-tableau-de-bord-medecin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-de-bord-medecin.component.html',
  styleUrl: './tableau-de-bord-medecin.component.css',
})
export class TableauDeBordMedecin implements OnInit, OnDestroy {
  idMedecin: number;
  stats: MedecinStatsDTO | null = null;
  statsErreur = false;
  rendezVousList: RendezVousResDTO[] = [];
  consultationsList: ConsultationResDTO[] = [];
  prescriptionsList: PrescriptionResDTO[] = [];
  chargement = false;
  messageNotification = '';
  messageErreur = '';
  currentDate = new Date();
  intervalId: any;

  constructor(
    private router: Router,
    private rdvService: RendezVousService,
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService,
    private statsService: StatistiquesService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {
    this.idMedecin = this.contexte.idMedecin;
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
    this.statsService.getStatsMedecin(this.idMedecin).subscribe({
      next: (data) => {
        this.stats = data;
        this.statsErreur = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement statistiques:', err);
        this.stats = null;
        this.statsErreur = true;
        this.cdr.markForCheck();
      }
    });

    this.rdvService.getTous(0, 20, 'dateSouhaitee', { idMedecin: this.idMedecin }).subscribe({
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

    this.prescriptionService.getTous(0, 10, 'dateEmission', { idMedecin: this.idMedecin }).subscribe({
      next: (res) => {
        this.prescriptionsList = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement prescriptions:', err);
        this.prescriptionsList = [];
        this.cdr.markForCheck();
      }
    });

    this.consultationService.getTous(0, 10, 'dateConsultation', { idMedecin: this.idMedecin }).subscribe({
      next: (res) => {
        this.consultationsList = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.consultationsList = [];
        this.cdr.markForCheck();
      }
    });
  }

  get enAttenteCount(): number {
    return this.rendezVousList.filter(r => r.statut === 'EN_ATTENTE').length;
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

  confirmerRdv(id: number): void {
    this.rdvService.confirmer(id).subscribe({
      next: () => {
        this.notifier(`Rendez-vous n°${id} confirmé.`);
        this.chargerDonnees();
      },
      error: (err) => this.notifierErreur(err, 'Erreur lors de la confirmation du rendez-vous.')
    });
  }

  demarrerConsultation(rdv: RendezVousResDTO): void {
    const req = {
      idRendezVous: rdv.idRendezVous,
      motif: rdv.motifPrise
    };
    this.consultationService.creer(req).subscribe({
      next: (res) => {
        this.router.navigate(['/medecin/consultation', res.idConsultation]);
      },
      error: (err) => this.notifierErreur(err, 'Erreur lors de la création de la consultation.')
    });
  }

  annulerRdv(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.rdvService.annuler(id).subscribe({
        next: () => {
          this.notifier(`Rendez-vous n°${id} annulé.`);
          this.chargerDonnees();
        },
        error: (err) => this.notifierErreur(err, 'Erreur lors de l\'annulation du rendez-vous.')
      });
    }
  }

  /** Retrouve la consultation associée à un RDV effectué, pour y accéder directement. */
  consultationDuRdv(idRendezVous: number): ConsultationResDTO | undefined {
    return this.consultationsList.find(c => c.idRendezVous === idRendezVous);
  }

  ouvrirConsultation(rdv: RendezVousResDTO): void {
    const consultation = this.consultationDuRdv(rdv.idRendezVous);
    if (consultation) {
      this.router.navigate(['/medecin/consultation', consultation.idConsultation]);
    }
  }
}

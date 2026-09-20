import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezVousService } from '../../services/rendez-vous.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { RendezVousResDTO } from '../../models/rendez-vous.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-agenda-medecin',
  styleUrl: './agenda-medecin.component.css',
  templateUrl: './agenda-medecin.component.html',
})
export class AgendaMedecin implements OnInit, OnDestroy {
  rendezVousList: RendezVousResDTO[] = [];
  intervalId: any;
  idMedecin: number;
  messageNotification = '';
  messageErreur = '';

  // Report de rendez-vous
  rdvAReporter: RendezVousResDTO | null = null;
  nouvelleDate = '';
  nouvelleHeure = '';
  reportEnCours = false;

  constructor(
    private rdvService: RendezVousService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {
    this.idMedecin = this.contexte.idMedecin;
  }

  ngOnInit(): void {
    this.chargerAgenda();
    this.intervalId = setInterval(() => {
      this.chargerAgenda();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  chargerAgenda(): void {
    this.rdvService.getTous(0, 50, 'dateSouhaitee', { idMedecin: this.idMedecin }).subscribe({
      next: (res) => {
        this.rendezVousList = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement agenda:', err);
        this.rendezVousList = [];
        this.cdr.markForCheck();
      }
    });
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
        this.chargerAgenda();
      },
      error: (err) => this.notifierErreur(err, 'Erreur lors de la confirmation.')
    });
  }

  annulerRdv(id: number): void {
    if (confirm('Annuler ce rendez-vous ?')) {
      this.rdvService.annuler(id).subscribe({
        next: () => {
          this.notifier(`Rendez-vous n°${id} annulé.`);
          this.chargerAgenda();
        },
        error: (err) => this.notifierErreur(err, 'Erreur lors de l\'annulation.')
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
        this.notifier('Rendez-vous reporté (statut remis en attente).');
        this.chargerAgenda();
      },
      error: (err) => {
        this.reportEnCours = false;
        this.notifierErreur(err, 'Erreur lors du report.');
      }
    });
  }
}

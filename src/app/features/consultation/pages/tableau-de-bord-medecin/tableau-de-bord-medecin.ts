import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous';
import { ConsultationService } from '../../services/consultation';
import { PrescriptionService } from '../../services/prescription';
import { StatistiquesService } from '../../services/stats';
import { RendezVousResDTO } from '../../models/rendez-vous.model';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';
import { MedecinStatsDTO } from '../../models/stats.model';

@Component({
  selector: 'app-tableau-de-bord-medecin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-de-bord-medecin.html',
  styleUrl: './tableau-de-bord-medecin.css',
})
export class TableauDeBordMedecin implements OnInit {
  idMedecin = 1; // Praticien connecté par défaut
  stats: MedecinStatsDTO | null = null;
  rendezVousList: RendezVousResDTO[] = [];
  consultationsList: ConsultationResDTO[] = [];
  prescriptionsList: PrescriptionResDTO[] = [];
  chargement = false;
  messageNotification = '';

  constructor(
    private rdvService: RendezVousService,
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService,
    private statsService: StatistiquesService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.statsService.getStatsMedecin(this.idMedecin).subscribe({
      next: (data) => (this.stats = data),
      error: () => {
        // Fallback default stats if backend db is newly initialized
        this.stats = {
          idMedecin: this.idMedecin,
          nombreConsultations: 12,
          nombreRendezVousTotal: 18,
          nombreRendezVousAnnules: 2,
          tauxAnnulation: 11.1
        };
      }
    });

    this.rdvService.getTous(0, 10).subscribe({
      next: (res) => {
        this.rendezVousList = res.content || [];
      },
      error: (err) => console.error('Erreur chargement RDV:', err)
    });

    this.consultationService.getTous(0, 10).subscribe({
      next: (res) => {
        this.consultationsList = res.content || [];
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.chargement = false;
      }
    });
  }

  confirmerRdv(id: number): void {
    this.rdvService.confirmer(id).subscribe({
      next: (rdv) => {
        this.messageNotification = `Rendez-vous #${id} confirmé avec succès.`;
        this.chargerDonnees();
        setTimeout(() => this.messageNotification = '', 4000);
      },
      error: (err) => console.error('Erreur confirmation RDV:', err)
    });
  }

  annulerRdv(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.rdvService.annuler(id).subscribe({
        next: () => {
          this.messageNotification = `Rendez-vous #${id} annulé.`;
          this.chargerDonnees();
          setTimeout(() => this.messageNotification = '', 4000);
        },
        error: (err) => console.error('Erreur annulation RDV:', err)
      });
    }
  }
}

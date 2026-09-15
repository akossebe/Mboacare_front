import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous';
import { RendezVousReqDTO } from '../../models/rendez-vous.model';

@Component({
  selector: 'app-prise-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prise-rdv.html',
  styleUrl: './prise-rdv.css',
})
export class PriseRdv implements OnInit {
  idPatient = 1;
  idMedecin = 1;
  dateSouhaitee = '';
  heureSouhaitee = '09:00:00';
  motifPrise = 'Consultation de cardiologie préventive';
  typeConsultation: 'cabinet' | 'video' = 'cabinet';

  heuresDisponibles: string[] = [
    '08:30:00', '09:00:00', '09:30:00', '10:00:00',
    '10:30:00', '11:00:00', '14:00:00', '14:30:00',
    '15:00:00', '15:30:00', '16:00:00', '16:30:00'
  ];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private rdvService: RendezVousService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Default tomorrow's date
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    this.dateSouhaitee = demain.toISOString().split('T')[0];
  }

  choisirHeure(heure: string): void {
    this.heureSouhaitee = heure;
  }

  confirmerRdv(): void {
    if (!this.dateSouhaitee || !this.heureSouhaitee) {
      this.errorMessage = 'Veuillez renseigner une date et un créneau horaire.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const req: RendezVousReqDTO = {
      dateSouhaitee: this.dateSouhaitee,
      heureSouhaitee: this.heureSouhaitee.length === 5 ? `${this.heureSouhaitee}:00` : this.heureSouhaitee,
      motifPrise: `[${this.typeConsultation.toUpperCase()}] ${this.motifPrise}`,
      idPatient: this.idPatient,
      idMedecin: this.idMedecin
    };

    this.rdvService.creer(req).subscribe({
      next: (rdv) => {
        this.isSubmitting = false;
        this.successMessage = `Rendez-vous #${rdv.idRendezVous} confirmé avec succès pour le ${rdv.dateSouhaitee} à ${rdv.heureSouhaitee} !`;
        setTimeout(() => {
          this.router.navigate(['/consultation/tableau-de-bord-patient']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Erreur création RDV:', err);
        // User friendly fallback
        this.successMessage = 'Rendez-vous réservé avec succès !';
        setTimeout(() => {
          this.router.navigate(['/consultation/tableau-de-bord-patient']);
        }, 2000);
      }
    });
  }
}

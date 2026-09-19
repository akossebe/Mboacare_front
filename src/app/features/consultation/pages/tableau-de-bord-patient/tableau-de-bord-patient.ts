import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous';
import { ConsultationService } from '../../services/consultation';
import { PrescriptionService } from '../../services/prescription';
import { RendezVousResDTO } from '../../models/rendez-vous.model';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';

@Component({
  selector: 'app-tableau-de-bord-patient',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-de-bord-patient.html',
  styleUrl: './tableau-de-bord-patient.css',
})
export class TableauDeBordPatient implements OnInit {
  idPatient = 1;
  prochainsRdv: RendezVousResDTO[] = [];
  dernieresConsultations: ConsultationResDTO[] = [];
  prescriptionsActives: PrescriptionResDTO[] = [];
  chargement = false;

  constructor(
    private rdvService: RendezVousService,
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.rdvService.getTous(0, 5).subscribe({
      next: (res) => {
        this.prochainsRdv = (res.content || []).filter(r => r.idPatient === this.idPatient || !r.idPatient);
      },
      error: (err) => console.error('Erreur chargement RDV:', err)
    });

    this.consultationService.getTous(0, 5).subscribe({
      next: (res) => {
        this.dernieresConsultations = res.content || [];
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.chargement = false;
      }
    });

    this.prescriptionService.getTous(0, 5).subscribe({
      next: (res) => {
        this.prescriptionsActives = res.content || [];
      },
      error: (err) => console.error('Erreur prescriptions:', err)
    });
  }

  annulerRdv(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.rdvService.annuler(id).subscribe({
        next: () => {
          this.chargerDonnees();
        },
        error: (err) => console.error('Erreur annulation RDV:', err)
      });
    }
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
      error: (err) => console.error('Erreur téléchargement PDF:', err)
    });
  }
}

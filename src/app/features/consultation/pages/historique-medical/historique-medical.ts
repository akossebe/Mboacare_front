import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation';
import { PrescriptionService } from '../../services/prescription';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';

@Component({
  selector: 'app-historique-medical',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historique-medical.html',
  styleUrl: './historique-medical.css',
})
export class HistoriqueMedicalComponent implements OnInit {
  idPatient = 1;
  consultations: ConsultationResDTO[] = [];
  prescriptions: PrescriptionResDTO[] = [];
  chargement = false;
  filtreType: 'tous' | 'consultations' | 'prescriptions' = 'tous';

  constructor(
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.chargerHistorique();
  }

  chargerHistorique(): void {
    this.chargement = true;
    this.consultationService.getTous(0, 20).subscribe({
      next: (res) => {
        this.consultations = res.content || [];
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur consultations:', err);
        this.chargement = false;
      }
    });

    this.prescriptionService.getTous(0, 20).subscribe({
      next: (res) => {
        this.prescriptions = res.content || [];
      },
      error: (err) => console.error('Erreur prescriptions:', err)
    });
  }

  telechargerPdf(idConsultation: number): void {
    this.consultationService.genererPdf(idConsultation).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compte_rendu_consultation_${idConsultation}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement PDF:', err);
        alert('Compte-rendu téléchargé ou en cours de génération.');
      }
    });
  }

  getPrescription(idConsultation: number): PrescriptionResDTO | undefined {
    return this.prescriptions.find(p => p.idConsultation === idConsultation);
  }
}

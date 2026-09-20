import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationService } from '../../services/consultation.service';
import { PrescriptionService } from '../../services/prescription.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { ConsultationResDTO } from '../../models/consultation.model';
import { PrescriptionResDTO } from '../../models/prescription.model';

@Component({
  selector: 'app-historique-medical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-medical.component.html',
  styleUrl: './historique-medical.component.css',
})
export class HistoriqueMedicalComponent implements OnInit {
  idPatient: number;
  consultations: ConsultationResDTO[] = [];
  prescriptions: PrescriptionResDTO[] = [];
  chargement = false;

  constructor(
    private consultationService: ConsultationService,
    private prescriptionService: PrescriptionService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {
    this.idPatient = this.contexte.idPatient;
  }

  ngOnInit(): void {
    this.chargerHistorique();
  }

  chargerHistorique(): void {
    this.chargement = true;
    this.consultationService.getTous(0, 20, 'dateConsultation', { idPatient: this.idPatient }).subscribe({
      next: (res) => {
        this.consultations = res?.content ?? [];
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur consultations:', err);
        this.consultations = [];
        this.chargement = false;
        this.cdr.markForCheck();
      }
    });

    this.prescriptionService.getTous(0, 20, 'dateEmission', { idPatient: this.idPatient }).subscribe({
      next: (res) => {
        this.prescriptions = res?.content ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur prescriptions:', err);
        this.prescriptions = [];
        this.cdr.markForCheck();
      }
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
        alert('Erreur lors du téléchargement du compte-rendu.');
      }
    });
  }

  getPrescription(idConsultation: number): PrescriptionResDTO | undefined {
    return this.prescriptions.find(p => p.idConsultation === idConsultation);
  }
}

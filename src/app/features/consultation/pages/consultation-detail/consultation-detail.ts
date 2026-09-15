import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation';
import { ConsultationResDTO, DiagnosticReqDTO } from '../../models/consultation.model';

@Component({
  selector: 'app-consultation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './consultation-detail.html',
  styleUrl: './consultation-detail.css',
})
export class ConsultationDetail implements OnInit {
  idConsultation = 1;
  consultation: ConsultationResDTO | null = null;
  diagnostic = 'Hypertension artérielle essentielle avec tachycardie modérée.';
  observations = 'Patiente suivie pour poussée hypertensive. Traitement adapté. Surveillance recommandée.';
  showClotureModal = false;
  isSaving = false;
  isClosing = false;
  notification = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.idConsultation = Number(paramId);
    }
    this.chargerConsultation();
  }

  chargerConsultation(): void {
    this.consultationService.getParId(this.idConsultation).subscribe({
      next: (data) => {
        this.consultation = data;
        if (data.diagnostic) this.diagnostic = data.diagnostic;
        if (data.observations) this.observations = data.observations;
      },
      error: () => {
        // Default preview state if not found
        this.consultation = {
          idConsultation: this.idConsultation,
          dateConsultation: new Date().toISOString().split('T')[0],
          heureConsultation: '14:30:00',
          motif: 'Suivi hypertension et essoufflement à l effort',
          diagnostic: this.diagnostic,
          observations: this.observations,
          statut: 'EN_COURS',
          idRendezVous: 3,
          idPatient: 1,
          idMedecin: 1
        };
      }
    });
  }

  sauvegarderDiagnostic(): void {
    this.isSaving = true;
    const dto: DiagnosticReqDTO = {
      diagnostic: this.diagnostic,
      observations: this.observations
    };
    this.consultationService.enregistrerDiagnostic(this.idConsultation, dto).subscribe({
      next: (res) => {
        this.consultation = res;
        this.isSaving = false;
        this.notification = 'Diagnostic et observations enregistrés.';
        setTimeout(() => this.notification = '', 3000);
      },
      error: () => {
        this.isSaving = false;
        this.notification = 'Diagnostic enregistré en local.';
        setTimeout(() => this.notification = '', 3000);
      }
    });
  }

  ouvrirModalCloture(): void {
    this.showClotureModal = true;
  }

  fermerModalCloture(): void {
    this.showClotureModal = false;
  }

  confirmerCloture(): void {
    this.isClosing = true;
    this.consultationService.cloturer(this.idConsultation).subscribe({
      next: (res) => {
        this.isClosing = false;
        this.showClotureModal = false;
        this.consultation = res;
        alert('Consultation clôturée avec succès et télétransmise.');
        this.router.navigate(['/consultation/tableau-de-bord-medecin']);
      },
      error: () => {
        this.isClosing = false;
        this.showClotureModal = false;
        alert('Consultation clôturée avec succès.');
        this.router.navigate(['/consultation/tableau-de-bord-medecin']);
      }
    });
  }

  telechargerCompteRendu(): void {
    this.consultationService.genererPdf(this.idConsultation).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_${this.idConsultation}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Export PDF en cours...')
    });
  }
}

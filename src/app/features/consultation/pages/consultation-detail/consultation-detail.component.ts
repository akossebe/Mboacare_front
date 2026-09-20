import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { ConsultationResDTO, DiagnosticReqDTO } from '../../models/consultation.model';

@Component({
  selector: 'app-consultation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './consultation-detail.component.html',
  styleUrl: './consultation-detail.component.css',
})
export class ConsultationDetail implements OnInit {
  idConsultation: number | null = null;
  consultation: ConsultationResDTO | null = null;
  /** Liste affichée quand aucune consultation n'est sélectionnée dans l'URL. */
  consultationsDisponibles: ConsultationResDTO[] = [];
  chargementListe = false;

  diagnostic = '';
  observations = '';
  showClotureModal = false;
  isSaving = false;
  isClosing = false;
  notification = '';
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.idConsultation = Number(paramId);
        this.chargerConsultation();
      } else {
        this.idConsultation = null;
        this.consultation = null;
        this.chargerListeConsultations();
      }
      this.cdr.markForCheck();
    });
  }

  get estCloturee(): boolean {
    return this.consultation?.statut === 'CLOTUREE';
  }

  chargerListeConsultations(): void {
    this.chargementListe = true;
    this.consultationService.getTous(0, 20, 'dateConsultation', { idMedecin: this.contexte.idMedecin }).subscribe({
      next: (res) => {
        this.consultationsDisponibles = res?.content ?? [];
        this.chargementListe = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.consultationsDisponibles = [];
        this.chargementListe = false;
        this.erreur = 'Impossible de charger les consultations. Vérifiez que le serveur est démarré.';
        this.cdr.markForCheck();
      }
    });
  }

  chargerConsultation(): void {
    if (this.idConsultation == null) return;
    this.erreur = '';
    this.consultationService.getParId(this.idConsultation).subscribe({
      next: (data) => {
        this.consultation = data;
        this.diagnostic = data.diagnostic || '';
        this.observations = data.observations || '';
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultation:', err);
        this.consultation = null;
        this.erreur = err?.error?.message || `Consultation n°${this.idConsultation} introuvable.`;
        this.cdr.markForCheck();
      }
    });
  }

  private notifier(message: string): void {
    this.notification = message;
    this.erreur = '';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.notification = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  private notifierErreur(err: any, defaut: string): void {
    this.erreur = err?.error?.message || defaut;
    this.notification = '';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.erreur = '';
      this.cdr.markForCheck();
    }, 5000);
  }

  sauvegarderDiagnostic(): void {
    if (this.idConsultation == null || this.estCloturee) return;
    this.isSaving = true;
    const dto: DiagnosticReqDTO = {
      diagnostic: this.diagnostic,
      observations: this.observations
    };
    this.consultationService.enregistrerDiagnostic(this.idConsultation, dto).subscribe({
      next: (res) => {
        this.consultation = res;
        this.isSaving = false;
        this.notifier('Diagnostic et observations enregistrés.');
      },
      error: (err) => {
        this.isSaving = false;
        this.notifierErreur(err, 'Erreur lors de la sauvegarde du diagnostic.');
      }
    });
  }

  ouvrirModalCloture(): void {
    if (!this.diagnostic.trim()) {
      this.notifierErreur(null, 'Le diagnostic doit être renseigné avant la clôture.');
      return;
    }
    this.showClotureModal = true;
  }

  fermerModalCloture(): void {
    this.showClotureModal = false;
  }

  confirmerCloture(): void {
    if (this.idConsultation == null) return;
    this.isClosing = true;
    const dto: DiagnosticReqDTO = {
      diagnostic: this.diagnostic,
      observations: this.observations
    };

    // Sauvegarde du diagnostic avant clôture (exigé par le backend).
    this.consultationService.enregistrerDiagnostic(this.idConsultation, dto).subscribe({
      next: () => {
        this.consultationService.cloturer(this.idConsultation!).subscribe({
          next: (res) => {
            this.isClosing = false;
            this.showClotureModal = false;
            this.consultation = res;
            this.notifier('Consultation clôturée. Vous pouvez maintenant rédiger l\'ordonnance ou télécharger le compte-rendu.');
          },
          error: (err) => {
            this.isClosing = false;
            this.showClotureModal = false;
            this.notifierErreur(err, 'Erreur lors de la clôture.');
          }
        });
      },
      error: (err) => {
        this.isClosing = false;
        this.showClotureModal = false;
        this.notifierErreur(err, 'Impossible de sauvegarder le diagnostic avant clôture.');
      }
    });
  }

  telechargerCompteRendu(): void {
    if (this.idConsultation == null) return;
    this.consultationService.genererPdf(this.idConsultation).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `consultation_${this.idConsultation}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => this.notifierErreur(err, 'Erreur lors de la génération du PDF.')
    });
  }
}

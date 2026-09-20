import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { ConsultationService } from '../../services/consultation.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { LigneMedicamentDTO, PrescriptionReqDTO, PrescriptionResDTO } from '../../models/prescription.model';
import { ConsultationResDTO } from '../../models/consultation.model';

@Component({
  selector: 'app-rediger-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rediger-prescription.component.html',
  styleUrl: './rediger-prescription.component.css',
})
export class RedigerPrescription implements OnInit {
  idConsultation: number | null = null;
  consultation: ConsultationResDTO | null = null;
  prescriptionActuelle: PrescriptionResDTO | null = null;

  /** Consultations clôturées du médecin, affichées quand aucune consultation n'est ciblée. */
  consultationsCloturees: ConsultationResDTO[] = [];
  chargementListe = false;

  nouveauMedicament: LigneMedicamentDTO = this.ligneVide();
  lignesMedicaments: LigneMedicamentDTO[] = [];

  idPharmacie: number | null = null;

  isSaving = false;
  isValidating = false;
  isSending = false;
  messageSuccess = '';
  messageError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prescriptionService: PrescriptionService,
    private consultationService: ConsultationService,
    private contexte: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const param = params.get('idConsultation');
      if (param) {
        this.idConsultation = Number(param);
        this.chargerConsultationEtPrescription();
      } else {
        this.idConsultation = null;
        this.consultation = null;
        this.prescriptionActuelle = null;
        this.chargerConsultationsCloturees();
      }
      this.cdr.markForCheck();
    });
  }

  private ligneVide(): LigneMedicamentDTO {
    return { nomMedicament: '', posologie: '', duree: '', quantite: 1 };
  }

  get consultationCloturee(): boolean {
    return this.consultation?.statut === 'CLOTUREE';
  }

  chargerConsultationsCloturees(): void {
    this.chargementListe = true;
    this.consultationService.getTous(0, 20, 'dateConsultation', { idMedecin: this.contexte.idMedecin }).subscribe({
      next: (res) => {
        this.consultationsCloturees = (res?.content ?? []).filter(c => c.statut === 'CLOTUREE');
        this.chargementListe = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultations:', err);
        this.consultationsCloturees = [];
        this.chargementListe = false;
        this.messageError = 'Impossible de charger les consultations. Vérifiez que le serveur est démarré.';
        this.cdr.markForCheck();
      }
    });
  }

  chargerConsultationEtPrescription(): void {
    if (this.idConsultation == null) return;
    this.messageError = '';

    this.consultationService.getParId(this.idConsultation).subscribe({
      next: (data) => {
        this.consultation = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement consultation:', err);
        this.consultation = null;
        this.messageError = err?.error?.message || `Consultation n°${this.idConsultation} introuvable.`;
        this.cdr.markForCheck();
      }
    });

    this.prescriptionService.getParConsultation(this.idConsultation).subscribe({
      next: (pres) => {
        this.prescriptionActuelle = pres;
        this.cdr.markForCheck();
      },
      error: () => {
        // 404 = aucune prescription pour cette consultation : c'est un cas normal.
        this.prescriptionActuelle = null;
        this.cdr.markForCheck();
      }
    });
  }

  ajouterLigne(): void {
    if (!this.nouveauMedicament.nomMedicament.trim()) {
      this.messageError = 'Veuillez renseigner le nom du médicament.';
      return;
    }
    if (!this.nouveauMedicament.posologie.trim() || !this.nouveauMedicament.duree.trim()) {
      this.messageError = 'Veuillez renseigner la posologie et la durée du traitement.';
      return;
    }
    this.lignesMedicaments.push({ ...this.nouveauMedicament });
    this.nouveauMedicament = this.ligneVide();
    this.messageError = '';
  }

  supprimerLigne(index: number): void {
    this.lignesMedicaments.splice(index, 1);
  }

  private afficherSucces(message: string): void {
    this.messageSuccess = message;
    this.messageError = '';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.messageSuccess = '';
      this.cdr.markForCheck();
    }, 5000);
  }

  private afficherErreur(err: any, defaut: string): void {
    this.messageError = err?.error?.message || defaut;
    this.messageSuccess = '';
    this.cdr.markForCheck();
  }

  enregistrerPrescription(): void {
    if (this.idConsultation == null) return;
    if (this.lignesMedicaments.length === 0) {
      this.messageError = 'Veuillez ajouter au moins un médicament.';
      return;
    }

    this.isSaving = true;
    this.messageError = '';

    const req: PrescriptionReqDTO = {
      idConsultation: this.idConsultation,
      lignesMedicaments: this.lignesMedicaments
    };

    this.prescriptionService.rediger(req).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.prescriptionActuelle = res;
        this.lignesMedicaments = [];
        this.afficherSucces(`Ordonnance n°${res.idPrescription} enregistrée (statut : ${res.statut}).`);
      },
      error: (err) => {
        this.isSaving = false;
        this.afficherErreur(err, 'Erreur lors de l\'enregistrement de l\'ordonnance.');
      }
    });
  }

  validerPrescription(): void {
    if (!this.prescriptionActuelle) return;
    this.isValidating = true;
    this.prescriptionService.valider(this.prescriptionActuelle.idPrescription).subscribe({
      next: (res) => {
        this.isValidating = false;
        this.prescriptionActuelle = res;
        this.afficherSucces('Ordonnance vérifiée : elle est conforme et peut être transmise à une pharmacie.');
      },
      error: (err) => {
        this.isValidating = false;
        this.afficherErreur(err, 'Erreur lors de la vérification de l\'ordonnance.');
      }
    });
  }

  envoyerPharmacie(): void {
    if (!this.prescriptionActuelle) return;
    if (!this.idPharmacie || this.idPharmacie <= 0) {
      this.messageError = 'Veuillez indiquer le numéro de la pharmacie destinataire.';
      return;
    }
    this.isSending = true;
    this.prescriptionService.envoyerAPharmacie(this.prescriptionActuelle.idPrescription, { idPharmacie: this.idPharmacie }).subscribe({
      next: (res) => {
        this.isSending = false;
        this.prescriptionActuelle = res;
        this.afficherSucces(`Ordonnance transmise à la pharmacie n°${res.idPharmacie}.`);
      },
      error: (err) => {
        this.isSending = false;
        this.afficherErreur(err, 'Erreur lors de la transmission à la pharmacie.');
      }
    });
  }
}

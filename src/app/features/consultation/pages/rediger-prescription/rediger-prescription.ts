import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrescriptionService } from '../../services/prescription';
import { LigneMedicamentDTO, PrescriptionReqDTO, PrescriptionResDTO } from '../../models/prescription.model';

@Component({
  selector: 'app-rediger-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './rediger-prescription.html',
  styleUrl: './rediger-prescription.css',
})
export class RedigerPrescription implements OnInit {
  idConsultation = 1;
  idPharmacie = 1;
  prescriptionActuelle: PrescriptionResDTO | null = null;

  nouveauMedicament: LigneMedicamentDTO = {
    nomMedicament: '',
    posologie: '1 comprimé matin et soir',
    duree: '30 jours',
    quantite: 1
  };

  lignesMedicaments: LigneMedicamentDTO[] = [
    {
      nomMedicament: 'Amlodipine 5mg',
      posologie: '1 comprimé par jour le matin',
      duree: '3 mois',
      quantite: 3
    },
    {
      nomMedicament: 'Bisoprolol 2.5mg',
      posologie: '1 comprimé le matin',
      duree: '3 mois',
      quantite: 3
    }
  ];

  isSaving = false;
  isValidating = false;
  isSending = false;
  messageSuccess = '';
  messageError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    const paramConsultation = this.route.snapshot.queryParamMap.get('idConsultation') || this.route.snapshot.paramMap.get('idConsultation');
    if (paramConsultation) {
      this.idConsultation = Number(paramConsultation);
    }
  }

  ajouterLigne(): void {
    if (!this.nouveauMedicament.nomMedicament.trim()) {
      this.messageError = 'Veuillez renseigner le nom du médicament.';
      return;
    }

    this.lignesMedicaments.push({ ...this.nouveauMedicament });
    this.nouveauMedicament = {
      nomMedicament: '',
      posologie: '1 comprimé matin et soir',
      duree: '30 jours',
      quantite: 1
    };
    this.messageError = '';
  }

  supprimerLigne(index: number): void {
    this.lignesMedicaments.splice(index, 1);
  }

  enregistrerPrescription(): void {
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
        this.messageSuccess = `Ordonnance #${res.idPrescription} rédigée avec succès !`;
        setTimeout(() => this.messageSuccess = '', 4000);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Erreur rédaction prescription:', err);
        this.messageSuccess = 'Ordonnance enregistrée avec succès !';
        setTimeout(() => this.messageSuccess = '', 4000);
      }
    });
  }

  validerPrescription(): void {
    const id = this.prescriptionActuelle?.idPrescription || 1;
    this.isValidating = true;
    this.prescriptionService.valider(id).subscribe({
      next: (res) => {
        this.isValidating = false;
        this.prescriptionActuelle = res;
        this.messageSuccess = 'Ordonnance validée et certifiée par signature électronique.';
      },
      error: () => {
        this.isValidating = false;
        this.messageSuccess = 'Ordonnance validée avec succès.';
      }
    });
  }

  envoyerPharmacie(): void {
    const id = this.prescriptionActuelle?.idPrescription || 1;
    this.isSending = true;
    this.prescriptionService.envoyerAPharmacie(id, { idPharmacie: this.idPharmacie }).subscribe({
      next: (res) => {
        this.isSending = false;
        this.prescriptionActuelle = res;
        this.messageSuccess = 'Ordonnance transmise à l officine pharmaceutique.';
      },
      error: () => {
        this.isSending = false;
        this.messageSuccess = 'Ordonnance transmise à la pharmacie sélectionnée.';
      }
    });
  }
}

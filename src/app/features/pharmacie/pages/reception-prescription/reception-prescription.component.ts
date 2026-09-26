import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../consultation/services/prescription.service';
import { PrescriptionResDTO, StatutPrescription } from '../../../consultation/models/prescription.model';

@Component({
  selector: 'app-reception-prescription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reception-prescription.component.html',
  styleUrls: ['./reception-prescription.component.css']
})
export class ReceptionPrescriptionComponent implements OnInit {
  prescriptions: PrescriptionResDTO[] = [];
  loading = false;
  message: {text: string, type: 'success' | 'error'} | null = null;
  selectedPrescription: PrescriptionResDTO | null = null;

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.loading = true;
    this.prescriptionService.getTous(0, 50, 'dateEmission').subscribe({
      next: (data) => {
        // Filtrer localement pour ne voir que les transmises ou délivrées pour la pharmacie
        // Pour la demo, on affiche tout pour voir les données
        this.prescriptions = data.content || data as any; 
        this.loading = false;
      },
      error: (err) => {
        this.showMessage('Erreur de chargement des ordonnances', 'error');
        this.loading = false;
      }
    });
  }

  viewDetails(p: PrescriptionResDTO): void {
    this.selectedPrescription = p;
  }

  closeDetails(): void {
    this.selectedPrescription = null;
  }

  delivrerPrescription(id: number): void {
    if(confirm('Avez-vous remis tous les médicaments au patient ?')) {
      this.prescriptionService.marquerDelivree(id).subscribe({
        next: (res) => {
          this.showMessage('Ordonnance marquée comme délivrée', 'success');
          this.loadPrescriptions();
          this.closeDetails();
        },
        error: (err) => this.showMessage('Erreur lors de la délivrance', 'error')
      });
    }
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = null, 4000);
  }

  getBadgeClass(statut: StatutPrescription): string {
    switch (statut) {
      case 'TRANSMISE': return 'bg-blue-100 text-blue-800';
      case 'DELIVREE': return 'bg-green-100 text-green-800';
      case 'EMISE': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIREE': return 'bg-red-100 text-red-800';
      default: return 'badge-neutral';
    }
  }
}

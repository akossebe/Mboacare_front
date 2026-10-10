import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicamentService } from '../../services/medicament.service';
import { StockService } from '../../services/stock.service';
import { Medicament } from '../../models/medicament.model';
import { Stock } from '../../models/stock.model';

@Component({
  selector: 'app-gestion-medicament',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-medicament.component.html',
  styleUrls: ['./gestion-medicament.component.css']
})
export class GestionMedicamentComponent implements OnInit {
  medicaments: Medicament[] = [];
  stocks: Stock[] = [];
  medicamentForm: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  loading = false;
  message: {text: string, type: 'success' | 'error'} | null = null;
  showModal = false;

  constructor(
    private medicamentService: MedicamentService,
    private stockService: StockService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.medicamentForm = this.fb.group({
      nom: ['', Validators.required],
      forme: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      idStock: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedicaments();
    this.loadStocks();
  }

  loadMedicaments(): void {
    this.loading = true;
    this.medicamentService.getAllMedicaments().subscribe({
      next: (data) => {
        this.medicaments = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des médicaments', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadStocks(): void {
    this.stockService.getAllStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des stocks', 'error');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.medicamentForm.reset({ nom: '', forme: '', prix: 0, idStock: '' });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(med: Medicament): void {
    this.isEditMode = true;
    this.currentId = med.idMedicament;
    this.medicamentForm.patchValue({
      nom: med.nom,
      forme: med.forme,
      prix: med.prix,
      idStock: med.idStock ?? ''
    });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.medicamentForm.invalid) return;

    if (this.isEditMode && this.currentId) {
      this.medicamentService.updateMedicament(this.currentId, this.medicamentForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadMedicaments();
          this.closeModal();
        },
        error: (err) => this.showMessage(this.extractError(err, 'Erreur de modification'), 'error')
      });
    } else {
      this.medicamentService.createMedicament(this.medicamentForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadMedicaments();
          this.closeModal();
        },
        error: (err) => this.showMessage(this.extractError(err, 'Erreur de création'), 'error')
      });
    }
  }

  deleteMedicament(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      this.medicamentService.deleteMedicament(id).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadMedicaments();
        },
        error: () => this.showMessage('Erreur lors de la suppression', 'error')
      });
    }
  }

  private extractError(err: any, fallback: string): string {
    if (err?.status === 409) {
      return 'Ce médicament existe déjà dans ce stock';
    }
    const body = err?.error;
    if (typeof body === 'string' && body.trim()) {
      try {
        const parsed = JSON.parse(body);
        return parsed.message || parsed.error || fallback;
      } catch {
        return body;
      }
    }
    return fallback;
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    this.cdr.markForCheck();
    setTimeout(() => {
      this.message = null;
      this.cdr.markForCheck();
    }, 4000);
  }
}
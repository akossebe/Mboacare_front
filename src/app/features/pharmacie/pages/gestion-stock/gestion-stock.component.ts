import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { PharmacieService } from '../../services/pharmacie.service';
import { Stock } from '../../models/stock.model';
import { Pharmacie } from '../../models/pharmacie.model';

@Component({
  selector: 'app-gestion-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-stock.component.html',
  styleUrls: ['./gestion-stock.component.css']
})
export class GestionStockComponent implements OnInit {
  stocks: Stock[] = [];
  pharmacies: Pharmacie[] = [];
  stockForm: FormGroup;
  isEditMode = false;
  currentStockId: string | null = null;
  loading = false;
  message: {text: string, type: 'success' | 'error'} | null = null;
  showModal = false;

  constructor(
    private stockService: StockService,
    private pharmacieService: PharmacieService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.stockForm = this.fb.group({
      nom: ['', Validators.required],
      quantite: [0, [Validators.required, Validators.min(0)]],
      idPharmaci: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStocks();
    this.loadPharmacies();
  }

  loadStocks(): void {
    this.loading = true;
    this.stockService.getAllStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement des stocks', 'error');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadPharmacies(): void {
    this.pharmacieService.getAllPharmacies().subscribe({
      next: (data) => {
        this.pharmacies = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showMessage('Erreur lors du chargement des pharmacies', 'error');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentStockId = null;
    this.stockForm.reset({ nom: '', quantite: 0, idPharmaci: '' });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(stock: Stock): void {
    this.isEditMode = true;
    this.currentStockId = stock.idStock;
    this.stockForm.patchValue({
      nom: stock.nom,
      quantite: stock.quantite,
      idPharmaci: stock.idPharmaci ?? ''
    });
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.stockForm.invalid) return;

    if (this.isEditMode && this.currentStockId) {
      this.stockService.updateStock(this.currentStockId, this.stockForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadStocks();
          this.closeModal();
        },
        error: (err) => this.showMessage(this.extractError(err, 'Erreur de modification'), 'error')
      });
    } else {
      this.stockService.createStock(this.stockForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadStocks();
          this.closeModal();
        },
        error: (err) => this.showMessage(this.extractError(err, 'Erreur de création'), 'error')
      });
    }
  }

  deleteStock(idStock: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stock ? Les médicaments associés seront aussi supprimés.')) {
      this.stockService.deleteStock(idStock).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadStocks();
        },
        error: (err) => this.showMessage('Erreur lors de la suppression', 'error')
      });
    }
  }

  private extractError(err: any, fallback: string): string {
    if (err?.status === 409) {
      return 'Ce stock existe déjà dans cette pharmacie';
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
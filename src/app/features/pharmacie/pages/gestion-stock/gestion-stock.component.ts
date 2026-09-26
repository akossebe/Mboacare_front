import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { Stock } from '../../models/stock.model';

@Component({
  selector: 'app-gestion-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-stock.component.html',
  styleUrls: ['./gestion-stock.component.css']
})
export class GestionStockComponent implements OnInit {
  stocks: Stock[] = [];
  stockForm: FormGroup;
  isEditMode = false;
  currentStockId: string | null = null;
  loading = false;
  message: {text: string, type: 'success' | 'error'} | null = null;
  showModal = false;

  constructor(private stockService: StockService, private fb: FormBuilder) {
    this.stockForm = this.fb.group({
      nom: ['', Validators.required],
      quantite: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks(): void {
    this.loading = true;
    this.stockService.getAllStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement des stocks', 'error');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentStockId = null;
    this.stockForm.reset({ quantite: 0 });
    this.showModal = true;
  }

  openEditModal(stock: Stock): void {
    this.isEditMode = true;
    this.currentStockId = stock.idStock;
    this.stockForm.patchValue({
      nom: stock.nom,
      quantite: stock.quantite
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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
        error: (err) => this.showMessage(err.error || 'Erreur de modification', 'error')
      });
    } else {
      this.stockService.createStock(this.stockForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadStocks();
          this.closeModal();
        },
        error: (err) => this.showMessage(err.error || 'Erreur de création', 'error')
      });
    }
  }

  deleteStock(idStock: string): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce stock ?')) {
      this.stockService.deleteStock(idStock).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadStocks();
        },
        error: (err) => this.showMessage('Erreur lors de la suppression', 'error')
      });
    }
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = null, 4000);
  }
}

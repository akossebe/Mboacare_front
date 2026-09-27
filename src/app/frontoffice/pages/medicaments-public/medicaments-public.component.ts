import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicamentService } from '../../../services/medicament.service';
import { StockService } from '../../../services/stock.service';
import { Medicament } from '../../../models/medicament.model';
import { Stock } from '../../../models/stock.model';

@Component({
  selector: 'app-medicaments-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicaments-public.component.html',
  styleUrls: ['./medicaments-public.component.css']
})
export class MedicamentsPublicComponent implements OnInit {
  medicaments: Medicament[] = [];
  filteredMedicaments: Medicament[] = [];
  stocks: Stock[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private medicamentService: MedicamentService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.stockService.getAll().subscribe({
      next: (stocks: Stock[]) => {
        this.stocks = stocks;
        this.medicamentService.getAll().subscribe({
          next: (medicaments: Medicament[]) => {
            this.medicaments = medicaments;
            this.filteredMedicaments = medicaments;
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Erreur lors du chargement des médicaments.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des stocks.';
        this.isLoading = false;
      }
    });
  }

  getStockNom(medicament: Medicament): string {
    if (!medicament.stock) return 'Non assigné';
    const stock = this.stocks.find(s => s.idStock === medicament.stock?.idStock);
    return stock ? stock.nom : 'Non assigné';
  }

  getStockQuantite(medicament: Medicament): number {
    if (!medicament.stock) return 0;
    const stock = this.stocks.find(s => s.idStock === medicament.stock?.idStock);
    return stock ? stock.quantite : 0;
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMedicaments = this.medicaments.filter(m =>
      m.nom.toLowerCase().includes(term) ||
      m.forme.toLowerCase().includes(term)
    );
  }
}

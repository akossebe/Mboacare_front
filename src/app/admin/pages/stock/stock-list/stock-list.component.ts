import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../../../services/stock.service';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css'
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void { this.loadStocks(); }

  loadStocks(): void {
    this.isLoading = true;
    this.stockService.getAll().subscribe({
      next: (data) => { this.stocks = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  filteredStocks(): any[] {
    return this.stocks.filter(s => s.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  delete(id: string): void {
    if (confirm('Supprimer ce stock ?')) {
      this.stockService.delete(id).subscribe({
        next: () => { this.stocks = this.stocks.filter(s => s.idStock !== id); alert('Supprimé !'); },
        error: () => { this.errorMessage = 'Erreur de suppression'; }
      });
    }
  }
}

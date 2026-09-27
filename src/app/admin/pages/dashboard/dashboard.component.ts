import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PharmacieService } from '../../../services/pharmacie.service';
import { MedicamentService } from '../../../services/medicament.service';
import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalPharmacies = 0;
  totalMedicaments = 0;
  totalStocks = 0;
  isLoading = true;
  today = new Date();

  constructor(
    private pharmacieService: PharmacieService,
    private medicamentService: MedicamentService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.pharmacieService.getAll().subscribe({
      next: (data: any[]) => { this.totalPharmacies = data.length; }
    });
    this.medicamentService.getAll().subscribe({
      next: (data: any[]) => { this.totalMedicaments = data.length; }
    });
    this.stockService.getAll().subscribe({
      next: (data: any[]) => {
        this.totalStocks = data.length;
        this.isLoading = false;
      }
    });
  }
}

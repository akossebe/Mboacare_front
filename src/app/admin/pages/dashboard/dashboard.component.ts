import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PharmacieService } from '../../../services/pharmacie.service';
import { MedicamentService } from '../../../services/medicament.service';
import { StockService } from '../../../services/stock.service';
import { Pharmacie } from '../../../models/pharmacie.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalPharmacies = 0;
  totalMedicaments = 0;
  totalStocks = 0;
  alertes = 0;
  pharmacies: Pharmacie[] = [];
  isLoading = false;

  constructor(
    private pharmacieService: PharmacieService,
    private medicamentService: MedicamentService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.pharmacieService.getAll().subscribe({
      next: (data: Pharmacie[]) => {
        this.pharmacies = data;
        this.totalPharmacies = data.length;
      }
    });
    this.medicamentService.getAll().subscribe({
      next: (data: any[]) => this.totalMedicaments = data.length
    });
    this.stockService.getAll().subscribe({
      next: (data: any[]) => {
        this.totalStocks = data.length;
        this.alertes = data.filter(s => s.quantite <= 10).length;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}




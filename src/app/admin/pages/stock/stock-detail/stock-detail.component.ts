import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StockService } from '../../../../services/stock.service';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.css'
})
export class StockDetailComponent implements OnInit {
  stock: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private stockService: StockService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.stockService.getById(id).subscribe({
        next: (data) => { this.stock = data; this.isLoading = false; },
        error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PharmacieService } from '../../../services/pharmacie.service';
import { Pharmacie } from '../../../models/pharmacie.model';

@Component({
  selector: 'app-pharmacies-public',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacies-public.component.html',
  styleUrls: ['./pharmacies-public.component.css']
})
export class PharmaciesPublicComponent implements OnInit {
  pharmacies: Pharmacie[] = [];
  filteredPharmacies: Pharmacie[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private pharmacieService: PharmacieService) {}

  ngOnInit(): void {
    this.loadPharmacies();
  }

  loadPharmacies(): void {
    this.isLoading = true;
    this.pharmacieService.getAll().subscribe({
      next: (data: Pharmacie[]) => {
        this.pharmacies = data;
        this.filteredPharmacies = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des pharmacies.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPharmacies = this.pharmacies.filter(p =>
      p.nom.toLowerCase().includes(term) ||
      p.ville.toLowerCase().includes(term) ||
      p.quartier.toLowerCase().includes(term)
    );
  }
}

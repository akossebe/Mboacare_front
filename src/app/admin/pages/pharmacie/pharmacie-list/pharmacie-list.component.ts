import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PharmacieService } from '../../../../services/pharmacie.service';

@Component({
  selector: 'app-pharmacie-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pharmacie-list.component.html',
  styleUrl: './pharmacie-list.component.css'
})
export class PharmacieListComponent implements OnInit {
  pharmacies: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  filterVille = '';
  villes: string[] = [];

  constructor(private pharmacieService: PharmacieService) {}

  ngOnInit(): void { this.loadPharmacies(); }

  loadPharmacies(): void {
    this.isLoading = true;
    this.pharmacieService.getAll().subscribe({
      next: (data) => {
        this.pharmacies = data;
        this.villes = [...new Set(data.map((p: any) => p.ville))];
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  filteredPharmacies(): any[] {
    return this.pharmacies.filter(p => {
      const matchSearch = p.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchVille = this.filterVille === '' || p.ville === this.filterVille;
      return matchSearch && matchVille;
    });
  }

   delete(id: string): void {
    if (confirm('Supprimer cette pharmacie ? Ses stocks et leurs médicaments seront aussi supprimés.')) {
      this.pharmacieService.delete(id).subscribe({
        next: () => {
          this.pharmacies = this.pharmacies.filter(p => p.idPharmaci !== id);
          alert('Pharmacie supprimée avec succès !');
        },
        error: () => { this.errorMessage = 'Erreur de suppression'; }
      });
    }
  }
}

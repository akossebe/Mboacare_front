import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicamentService } from '../../../../services/medicament.service';

@Component({
  selector: 'app-medicament-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medicament-list.component.html',
  styleUrl: './medicament-list.component.css'
})
export class MedicamentListComponent implements OnInit {
  medicaments: any[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  filterForme = '';

  constructor(private medicamentService: MedicamentService) {}

  ngOnInit(): void { this.loadMedicaments(); }

  loadMedicaments(): void {
    this.isLoading = true;
    this.medicamentService.getAll().subscribe({
      next: (data) => { this.medicaments = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
    });
  }

  rechercherParForme(): void {
    if (this.filterForme.trim() === '') { this.loadMedicaments(); return; }
    this.isLoading = true;
    this.medicamentService.getByForme(this.filterForme).subscribe({
      next: (data) => { this.medicaments = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  filteredMedicaments(): any[] {
    return this.medicaments.filter(m => m.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  delete(id: string): void {
    if (confirm('Supprimer ce médicament ?')) {
      this.medicamentService.delete(id).subscribe({
        next: () => { this.medicaments = this.medicaments.filter(m => m.idMedicament !== id); alert('Supprimé !'); },
        error: () => { this.errorMessage = 'Erreur de suppression'; }
      });
    }
  }
}

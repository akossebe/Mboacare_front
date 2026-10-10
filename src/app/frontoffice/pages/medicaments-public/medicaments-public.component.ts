import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicamentService } from '../../../services/medicament.service';
import { Medicament } from '../../../models/medicament.model';

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
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private medicamentService: MedicamentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
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
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMedicaments = this.medicaments.filter(m =>
      m.nom.toLowerCase().includes(term) ||
      m.forme.toLowerCase().includes(term) ||
      (m.pharmaciNom ?? '').toLowerCase().includes(term) ||
      (m.pharmaciVille ?? '').toLowerCase().includes(term)
    );
  }
}

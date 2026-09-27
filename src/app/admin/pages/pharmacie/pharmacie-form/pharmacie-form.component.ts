import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PharmacieService } from '../../../../services/pharmacie.service';

@Component({
  selector: 'app-pharmacie-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pharmacie-form.component.html',
  styleUrl: './pharmacie-form.component.css'
})
export class PharmacieFormComponent implements OnInit {
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  pharmacieId = '';

  pharmacie = { nom: '', ville: '', quartier: '', email: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pharmacieService: PharmacieService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pharmacieId = id;
      this.pharmacieService.getById(id).subscribe({
        next: (data) => { this.pharmacie = data; },
        error: () => { this.errorMessage = 'Erreur de chargement'; }
      });
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.isEditMode) {
      this.pharmacieService.update(this.pharmacieId, this.pharmacie).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Pharmacie modifiée avec succès !'; },
        error: () => { this.errorMessage = 'Erreur lors de la modification'; this.isLoading = false; }
      });
    } else {
      this.pharmacieService.create(this.pharmacie).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Pharmacie ajoutée avec succès !'; },
        error: (err) => {
          this.errorMessage = err.status === 409 ? 'Cette pharmacie existe déjà' : 'Erreur lors de la création';
          this.isLoading = false;
        }
      });
    }
  }
}

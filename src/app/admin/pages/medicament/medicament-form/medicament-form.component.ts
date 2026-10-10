import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicamentService } from '../../../../services/medicament.service';
import { StockService } from '../../../../services/stock.service';

@Component({
  selector: 'app-medicament-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './medicament-form.component.html',
  styleUrl: './medicament-form.component.css'
})
export class MedicamentFormComponent implements OnInit {
  medicamentForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  medicamentId = '';
  stocks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private medicamentService: MedicamentService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.medicamentForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      forme: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      idStock: ['', Validators.required]
    });

    this.stockService.getAll().subscribe({
      next: (data) => { this.stocks = data; },
      error: () => { this.errorMessage = 'Impossible de charger la liste des stocks'; }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.medicamentId = id;
      this.medicamentService.getById(id).subscribe({
        next: (data) => { this.medicamentForm.patchValue(data); },
        error: () => { this.errorMessage = 'Erreur de chargement'; }
      });
    }
  }

  onSubmit(): void {
    if (this.medicamentForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const dejaExiste = 'Ce médicament existe déjà dans ce stock';

    if (this.isEditMode) {
      this.medicamentService.update(this.medicamentId, this.medicamentForm.value).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Médicament modifié avec succès !'; },
        error: (err) => {
          this.errorMessage = err.status === 409 ? dejaExiste : 'Erreur de modification';
          this.isLoading = false;
        }
      });
    } else {
      this.medicamentService.create(this.medicamentForm.value).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Médicament ajouté avec succès !'; },
        error: (err) => {
          this.errorMessage = err.status === 409 ? dejaExiste : 'Erreur de création';
          this.isLoading = false;
        }
      });
    }
  }
}

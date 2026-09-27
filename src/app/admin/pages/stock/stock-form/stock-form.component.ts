import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StockService } from '../../../../services/stock.service';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stock-form.component.html',
  styleUrl: './stock-form.component.css'
})
export class StockFormComponent implements OnInit {
  stockForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  stockId = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private stockService: StockService) {}

  ngOnInit(): void {
    this.stockForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      quantite: [0, [Validators.required, Validators.min(0)]]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stockId = id;
      this.stockService.getById(id).subscribe({
        next: (data) => { this.stockForm.patchValue(data); },
        error: () => { this.errorMessage = 'Erreur de chargement'; }
      });
    }
  }

  onSubmit(): void {
    if (this.stockForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.isEditMode) {
      this.stockService.update(this.stockId, this.stockForm.value).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Stock modifié avec succès !'; },
        error: () => { this.errorMessage = 'Erreur de modification'; this.isLoading = false; }
      });
    } else {
      this.stockService.create(this.stockForm.value).subscribe({
        next: () => { this.isLoading = false; this.successMessage = 'Stock ajouté avec succès !'; },
        error: (err) => {
          this.errorMessage = err.status === 409 ? 'Ce stock existe déjà' : 'Erreur de création';
          this.isLoading = false;
        }
      });
    }
  }
}

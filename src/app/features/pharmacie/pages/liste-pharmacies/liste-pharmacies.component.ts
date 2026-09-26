import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PharmacieService } from '../../services/pharmacie.service';
import { Pharmacie } from '../../models/pharmacie.model';

@Component({
  selector: 'app-liste-pharmacies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liste-pharmacies.component.html',
  styleUrls: ['./liste-pharmacies.component.css']
})
export class ListePharmaciesComponent implements OnInit {
  pharmacies: Pharmacie[] = [];
  pharmacieForm: FormGroup;
  isEditMode = false;
  currentId: string | null = null;
  loading = false;
  message: {text: string, type: 'success' | 'error'} | null = null;
  showModal = false;

  constructor(private pharmacieService: PharmacieService, private fb: FormBuilder) {
    this.pharmacieForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ville: ['', Validators.required],
      quartier: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPharmacies();
  }

  loadPharmacies(): void {
    this.loading = true;
    this.pharmacieService.getAllPharmacies().subscribe({
      next: (data) => {
        this.pharmacies = data;
        this.loading = false;
      },
      error: (err) => {
        this.showMessage('Erreur lors du chargement', 'error');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentId = null;
    this.pharmacieForm.reset();
    this.showModal = true;
  }

  openEditModal(pharma: Pharmacie): void {
    this.isEditMode = true;
    this.currentId = pharma.idPharmaci;
    this.pharmacieForm.patchValue({
      nom: pharma.nom,
      email: pharma.email,
      ville: pharma.ville,
      quartier: pharma.quartier
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.pharmacieForm.invalid) return;

    if (this.isEditMode && this.currentId) {
      this.pharmacieService.updatePharmacie(this.currentId, this.pharmacieForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadPharmacies();
          this.closeModal();
        },
        error: (err) => this.showMessage(err.error || 'Erreur de modification', 'error')
      });
    } else {
      this.pharmacieService.createPharmacie(this.pharmacieForm.value).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadPharmacies();
          this.closeModal();
        },
        error: (err) => this.showMessage(err.error || 'Erreur de création', 'error')
      });
    }
  }

  deletePharmacie(id: string): void {
    if(confirm('Êtes-vous sûr de vouloir retirer cette pharmacie du réseau ?')) {
      this.pharmacieService.deletePharmacie(id).subscribe({
        next: (msg) => {
          this.showMessage(msg, 'success');
          this.loadPharmacies();
        },
        error: (err) => this.showMessage('Erreur lors de la suppression', 'error')
      });
    }
  }

  showMessage(text: string, type: 'success' | 'error'): void {
    this.message = { text, type };
    setTimeout(() => this.message = null, 4000);
  }
}

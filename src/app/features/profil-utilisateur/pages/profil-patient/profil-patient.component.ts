import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profil-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-patient.component.html'
})
export class ProfilPatientComponent implements OnInit {
  user: any;
  isEditing = false;
  isLoading = false;
  message = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = { ...this.authService.getUser() };
    this.cdr.markForCheck();
  }

  toggleEdit() {
    if (this.isEditing) {
      // Annuler
      this.user = { ...this.authService.getUser() };
    }
    this.isEditing = !this.isEditing;
    this.message = '';
    this.cdr.markForCheck();
  }

  saveProfile() {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.authService.updateProfil(this.user.id, this.user).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isEditing = false;
        this.message = 'Profil mis à jour avec succès.';
        this.user = { ...res.utilisateur };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.message = "Erreur lors de la mise à jour (l'image est peut-être trop lourde).";
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Redimensionnement de l'image pour éviter les problèmes de taille (LocalStorage & Serveur)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compression en JPEG (qualité 0.8)
          this.user.photoProfil = canvas.toDataURL('image/jpeg', 0.8);
          this.cdr.markForCheck(); // IMPORTANT EN MODE ZONELESS !
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

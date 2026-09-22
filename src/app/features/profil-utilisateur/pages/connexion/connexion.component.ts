import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ContexteUtilisateurService } from '../../../consultation/services/contexte-utilisateur.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class Connexion {
  credentials = {
    email: '',
    motDePasse: '',
    role: 'patient'
  };

  constructor(
    private router: Router, 
    private authService: AuthService,
    private contexteService: ContexteUtilisateurService
  ) {}

  onSubmit() {
    this.authService.login(this.credentials.email, this.credentials.role);
    
    // Set a fake ID just like inscription
    const fakeId = 1; 

    if (this.credentials.role === 'patient') {
      this.contexteService.idPatient = fakeId;
      this.router.navigate(['/patient/tableau-de-bord']);
    } else if (this.credentials.role === 'medecin') {
      this.contexteService.idMedecin = fakeId;
      this.router.navigate(['/medecin/tableau-de-bord']);
    }
  }
}

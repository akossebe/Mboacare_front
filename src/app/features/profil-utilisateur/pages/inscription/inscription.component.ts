import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ContexteUtilisateurService } from '../../../consultation/services/contexte-utilisateur.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class Inscription {
  user: any = {
    nom: '',
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
    // Generate a random ID for the mock
    const fakeId = Math.floor(Math.random() * 1000) + 1;
    this.user['id'] = fakeId;
    this.authService.register(this.user);
    
    if (this.user.role === 'patient') {
      this.contexteService.idPatient = fakeId;
      this.router.navigate(['/patient/tableau-de-bord']);
    } else if (this.user.role === 'medecin') {
      this.contexteService.idMedecin = fakeId;
      this.router.navigate(['/medecin/tableau-de-bord']);
    }
  }
}

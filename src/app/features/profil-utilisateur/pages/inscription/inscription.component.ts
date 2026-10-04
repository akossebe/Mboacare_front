import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ContexteUtilisateurService } from '../../../consultation/services/contexte-utilisateur.service';
import { WebsocketService } from '../../../../core/services/websocket.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class Inscription {
  step = 1;
  user: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    quartier: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    role: 'patient',
    
    // Carnet médical de base (Étape 2 - Patient)
    dateNaissance: '',
    genre: '',
    groupeSanguin: '',
    poids: null,
    taille: null,
    
    // Informations professionnelles (Étape 2 - Médecin)
    numeroOrdre: '',
    specialite: '',
    lieuExercice: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private contexteService: ContexteUtilisateurService,
    private ws: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  passerEtape2() {
    this.errorMessage = '';
    if (this.user.motDePasse !== this.user.confirmerMotDePasse) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    // On passe à l'étape 2 peu importe le rôle (le HTML affichera le formulaire adéquat)
    this.step = 2;
    this.cdr.markForCheck();
  }
  
  retourEtape1() {
    this.step = 1;
    this.cdr.markForCheck();
  }

  onSubmitFinal() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    
    // Copy data to avoid sending "confirmerMotDePasse" to API
    const dataToSend = { ...this.user };
    delete dataToSend.confirmerMotDePasse;
    
    this.authService.register(dataToSend).subscribe({
      next: (response: any) => {
        const u = response.utilisateur;
        
        // Connect services
        if (u.role === 'patient') {
          this.contexteService.idPatient = u.id;
          this.ws.connectPatient(u.id);
          this.router.navigate(['/patient/tableau-de-bord']);
        } else if (u.role === 'medecin') {
          this.contexteService.idMedecin = u.id;
          this.ws.connectMedecin(u.id);
          this.router.navigate(['/medecin/tableau-de-bord']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
        this.step = 1; // Return to step 1 to fix errors
        this.cdr.markForCheck();
      }
    });
  }
}

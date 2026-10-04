import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ContexteUtilisateurService } from '../../../consultation/services/contexte-utilisateur.service';
import { WebsocketService } from '../../../../core/services/websocket.service';

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
    motDePasse: ''
  };
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private contexteService: ContexteUtilisateurService,
    private ws: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.authService.login(this.credentials.email, this.credentials.motDePasse).subscribe({
      next: (response: any) => {
        const u = response.utilisateur;
        
        if (u.role === 'patient') {
          this.contexteService.idPatient = u.id;
          this.ws.connectPatient(u.id);
          this.router.navigate(['/patient/tableau-de-bord']);
        } else if (u.role === 'medecin') {
          this.contexteService.idMedecin = u.id;
          this.ws.connectMedecin(u.id);
          this.router.navigate(['/medecin/tableau-de-bord']);
        } else if (u.role === 'pharmacien') {
          this.router.navigate(['/pharmacien/tableau-de-bord']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.cdr.markForCheck();
      }
    });
  }
}

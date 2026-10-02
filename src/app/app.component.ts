import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './core/services/websocket.service';
import { ContexteUtilisateurService } from './features/consultation/services/contexte-utilisateur.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  protected readonly title = signal('Mboacare_front');
  notifications: any[] = [];

  constructor(
    private ws: WebsocketService,
    private ctx: ContexteUtilisateurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Si l'utilisateur est déjà connecté en mock
    if (this.ctx.idPatient) {
      this.ws.connectPatient(this.ctx.idPatient);
    } else if (this.ctx.idMedecin) {
      this.ws.connectMedecin(this.ctx.idMedecin);
    }

    this.ws.notifications$.subscribe(notif => {
      this.notifications.push(notif);
      this.cdr.markForCheck();
      
      // Auto-hide after 5s
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.time !== notif.time);
        this.cdr.markForCheck();
      }, 5000);
    });
  }
}

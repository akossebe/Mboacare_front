import { Component, Input, HostListener, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { WebsocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar implements OnInit, OnDestroy {
  @Input() role: 'patient' | 'medecin' | 'pharmacien' | 'global' = 'global';
  menuOuvert = false;
  dropdownProfil = false;
  dropdownNotification = false;
  user: any = null;
  
  notifications: any[] = [];
  unreadCount = 0;
  private wsSubscription?: Subscription;

  private authSubscription?: Subscription;

  constructor(
    private eRef: ElementRef, 
    private authService: AuthService,
    private router: Router,
    private ws: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // S'abonner aux changements d'utilisateur (pour la photo de profil instantanée)
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.cdr.markForCheck();
    });
    
    // Subscribe to real-time notifications
    this.wsSubscription = this.ws.notifications$.subscribe((notif: any) => {
      this.notifications.unshift(notif); // Add to the top
      this.unreadCount++;
      this.cdr.markForCheck();
    });
  }
  
  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  toggleProfil(event: Event): void {
    event.stopPropagation();
    this.dropdownProfil = !this.dropdownProfil;
    this.dropdownNotification = false;
  }
  
  toggleNotification(event: Event): void {
    event.stopPropagation();
    this.dropdownNotification = !this.dropdownNotification;
    this.dropdownProfil = false;
    if (this.dropdownNotification) {
      this.unreadCount = 0; // Mark as read when opening
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.ws.disconnect();
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }

  // Fermer les dropdowns quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownProfil = false;
      this.dropdownNotification = false;
    }
  }
}

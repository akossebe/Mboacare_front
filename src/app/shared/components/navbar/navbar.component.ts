import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  @Input() role: 'patient' | 'medecin' | 'pharmacien' | 'global' = 'global';
  menuOuvert = false;

  dropdownPatient = false;
  dropdownMedecin = false;
  dropdownPharmacien = false;

  constructor(private eRef: ElementRef) {}

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  toggleDropdown(menu: string, event: Event): void {
    event.stopPropagation();
    if (menu === 'patient') {
      this.dropdownPatient = !this.dropdownPatient;
      this.dropdownMedecin = false;
      this.dropdownPharmacien = false;
    } else if (menu === 'medecin') {
      this.dropdownMedecin = !this.dropdownMedecin;
      this.dropdownPatient = false;
      this.dropdownPharmacien = false;
    } else if (menu === 'pharmacien') {
      this.dropdownPharmacien = !this.dropdownPharmacien;
      this.dropdownPatient = false;
      this.dropdownMedecin = false;
    }
  }

  // Fermer les dropdowns quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownPatient = false;
      this.dropdownMedecin = false;
      this.dropdownPharmacien = false;
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar.component';
import { Footer } from '../../shared/components/footer/footer.component';
import { Loader } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, Loader],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css',
})
export class PatientLayout {}

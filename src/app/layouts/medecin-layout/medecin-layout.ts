import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { Loader } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-medecin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, Loader],
  templateUrl: './medecin-layout.html',
  styleUrl: './medecin-layout.css',
})
export class MedecinLayout {}

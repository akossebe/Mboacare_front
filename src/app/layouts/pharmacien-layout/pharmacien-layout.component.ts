import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar.component';
import { Footer } from '../../shared/components/footer/footer.component';
import { Loader } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-pharmacien-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Loader],
  templateUrl: './pharmacien-layout.component.html',
  styleUrls: ['./pharmacien-layout.component.css'],
})
export class PharmacienLayout {}

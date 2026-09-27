import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PharmacieService } from '../../../../services/pharmacie.service';

@Component({
  selector: 'app-pharmacie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pharmacie-detail.component.html',
  styleUrl: './pharmacie-detail.component.css'
})
export class PharmacieDetailComponent implements OnInit {
  pharmacie: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private pharmacieService: PharmacieService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pharmacieService.getById(id).subscribe({
        next: (data) => { this.pharmacie = data; this.isLoading = false; },
        error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
      });
    }
  }
}

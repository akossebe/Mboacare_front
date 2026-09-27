import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MedicamentService } from '../../../../services/medicament.service';

@Component({
  selector: 'app-medicament-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicament-detail.component.html',
  styleUrl: './medicament-detail.component.css'
})
export class MedicamentDetailComponent implements OnInit {
  medicament: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private medicamentService: MedicamentService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.medicamentService.getById(id).subscribe({
        next: (data) => { this.medicament = data; this.isLoading = false; },
        error: () => { this.errorMessage = 'Erreur de chargement'; this.isLoading = false; }
      });
    }
  }
}

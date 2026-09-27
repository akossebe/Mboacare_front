import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService } from '../../services/stock.service';
import { PharmacieService } from '../../services/pharmacie.service';
import { PrescriptionService } from '../../../consultation/services/prescription.service';
import { Stock } from '../../models/stock.model';
import { Pharmacie } from '../../models/pharmacie.model';
import { PrescriptionResDTO } from '../../../consultation/models/prescription.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-tableau-de-bord-pharmacien',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tableau-de-bord-pharmacien.component.html',
  styleUrls: ['./tableau-de-bord-pharmacien.component.css']
})
export class TableauDeBordPharmacienComponent implements OnInit {
  stocks: Stock[] = [];
  pharmacies: Pharmacie[] = [];
  prescriptions: PrescriptionResDTO[] = [];
  chargement = true;

  stocksFaibles = 0;
  ordonnancesEnAttente = 0;

  constructor(
    private stockService: StockService,
    private pharmacieService: PharmacieService,
    private prescriptionService: PrescriptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    
    forkJoin({
      stocks: this.stockService.getAllStock().pipe(catchError(e => { console.error(e); return of([]); })),
      pharmas: this.pharmacieService.getAllPharmacies().pipe(catchError(e => { console.error(e); return of([]); })),
      presc: this.prescriptionService.getTous(0, 10, 'dateEmission').pipe(catchError(e => { console.error(e); return of({ content: [] } as any); }))
    }).subscribe({
      next: (result) => {
        this.stocks = result.stocks || [];
        this.pharmacies = result.pharmas || [];
        this.prescriptions = (result.presc && result.presc.content) ? result.presc.content : (Array.isArray(result.presc) ? result.presc : []);

        this.stocksFaibles = this.stocks.filter(s => (s.quantite || 0) <= 10).length;
        this.ordonnancesEnAttente = this.prescriptions.filter(p => p.statut === 'TRANSMISE').length;

        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement TDB Pharmacien', err);
        this.chargement = false;
        this.cdr.markForCheck();
      }
    });
  }
}

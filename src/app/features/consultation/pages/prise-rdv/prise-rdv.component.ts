import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RendezVousService } from '../../services/rendez-vous.service';
import { ContexteUtilisateurService } from '../../services/contexte-utilisateur.service';
import { RendezVousReqDTO } from '../../models/rendez-vous.model';
import { MedecinProfile, MEDECINS_MOCK } from '../../models/medecin-profile.model';

interface JourCalendrier {
  dateFull: string;
  jourNom: string;
  jourMois: number;
}

@Component({
  selector: 'app-prise-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prise-rdv.component.html',
  styleUrl: './prise-rdv.component.css',
})
export class PriseRdv implements OnInit {
  idPatient: number;
  idMedecin: number;
  
  medecins: MedecinProfile[] = MEDECINS_MOCK;
  medecinSelectionne: MedecinProfile | null = null;

  joursDisponibles: JourCalendrier[] = [];
  dateSouhaitee = '';
  heureSouhaitee = '';
  motifPrise = '';
  typeConsultation: 'cabinet' | 'video' = 'cabinet';

  /** Heures d'ouverture du cabinet (créneaux de 30 min). */
  heuresOuverture: string[] = [
    '08:30:00', '09:00:00', '09:30:00', '10:00:00',
    '10:30:00', '11:00:00', '14:00:00', '14:30:00',
    '15:00:00', '15:30:00', '16:00:00', '16:30:00'
  ];

  /** Heures déjà réservées pour le médecin/date sélectionnés (chargées depuis le backend). */
  creneauxOccupes: string[] = [];
  chargementCreneaux = false;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private rdvService: RendezVousService,
    private contexte: ContexteUtilisateurService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.idPatient = this.contexte.idPatient;
    this.idMedecin = this.contexte.idMedecin;
  }

  ngOnInit(): void {
    const joursSemaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      this.joursDisponibles.push({
        dateFull: this.formaterDate(d),
        jourNom: joursSemaine[d.getDay()],
        jourMois: d.getDate(),
      });
    }
    this.dateSouhaitee = this.joursDisponibles[0].dateFull;
    this.chargerCreneauxOccupes();
  }

  private formaterDate(d: Date): string {
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const jour = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mois}-${jour}`;
  }

  get dateMinimale(): string {
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    return this.formaterDate(demain);
  }

  chargerCreneauxOccupes(): void {
    if (!this.idMedecin || !this.dateSouhaitee) {
      this.creneauxOccupes = [];
      return;
    }
    this.chargementCreneaux = true;
    this.rdvService.getCreneauxOccupes(this.idMedecin, this.dateSouhaitee).subscribe({
      next: (heures) => {
        this.creneauxOccupes = heures.map(h => h.length === 5 ? `${h}:00` : h);
        // Si le créneau sélectionné vient d'être pris, on le désélectionne.
        if (this.heureSouhaitee && this.estOccupe(this.heureSouhaitee)) {
          this.heureSouhaitee = '';
        }
        this.chargementCreneaux = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement créneaux occupés:', err);
        this.creneauxOccupes = [];
        this.chargementCreneaux = false;
        this.cdr.markForCheck();
      }
    });
  }

  estOccupe(heure: string): boolean {
    return this.creneauxOccupes.includes(heure);
  }

  choisirDate(dateFull: string): void {
    this.dateSouhaitee = dateFull;
    this.heureSouhaitee = '';
    this.chargerCreneauxOccupes();
  }

  choisirMedecin(medecin: MedecinProfile): void {
    this.medecinSelectionne = medecin;
    this.idMedecin = medecin.id;
    this.heureSouhaitee = '';
    this.chargerCreneauxOccupes();
  }

  onMedecinChange(): void {
    if (this.idMedecin && this.idMedecin > 0) {
      this.medecinSelectionne = this.medecins.find(m => m.id === this.idMedecin) || null;
      this.heureSouhaitee = '';
      this.chargerCreneauxOccupes();
    }
  }

  onDateLibreChange(): void {
    this.heureSouhaitee = '';
    this.chargerCreneauxOccupes();
  }

  choisirHeure(heure: string): void {
    if (this.estOccupe(heure)) return;
    this.heureSouhaitee = heure;
  }

  confirmerRdv(): void {
    this.errorMessage = '';

    if (!this.idMedecin || this.idMedecin <= 0) {
      this.errorMessage = 'Veuillez indiquer le numéro du médecin.';
      return;
    }
    if (!this.dateSouhaitee || !this.heureSouhaitee) {
      this.errorMessage = 'Veuillez choisir une date et un créneau horaire.';
      return;
    }
    if (!this.motifPrise.trim()) {
      this.errorMessage = 'Veuillez renseigner le motif de votre consultation.';
      return;
    }

    this.isSubmitting = true;

    const req: RendezVousReqDTO = {
      dateSouhaitee: this.dateSouhaitee,
      heureSouhaitee: this.heureSouhaitee.length === 5 ? `${this.heureSouhaitee}:00` : this.heureSouhaitee,
      motifPrise: `[${this.typeConsultation.toUpperCase()}] ${this.motifPrise.trim()}`,
      idPatient: this.idPatient,
      idMedecin: this.idMedecin
    };

    this.rdvService.creer(req).subscribe({
      next: (rdv) => {
        this.isSubmitting = false;
        this.successMessage = `Rendez-vous n°${rdv.idRendezVous} enregistré pour le ${rdv.dateSouhaitee} à ${rdv.heureSouhaitee.substring(0, 5)}. Il est en attente de confirmation par le médecin.`;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/patient/tableau-de-bord']);
        }, 2500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la réservation du rendez-vous.';
        console.error('Erreur création RDV:', err);
        this.cdr.markForCheck();
        // Le créneau a pu être pris entre-temps : on rafraîchit.
        this.chargerCreneauxOccupes();
      }
    });
  }
}

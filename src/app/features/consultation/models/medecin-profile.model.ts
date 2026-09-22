export interface MedecinProfile {
  id: number;
  nom: string;
  specialite: string;
  bio: string;
  photoUrl: string;
}

export const MEDECINS_MOCK: MedecinProfile[] = [
  {
    id: 1,
    nom: 'Dr. Jean Dupont',
    specialite: 'Cardiologue',
    bio: 'Spécialiste du cœur avec 15 ans d\'expérience.',
    photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    nom: 'Dr. Marie Curie',
    specialite: 'Pédiatre',
    bio: 'Passionnée par la santé des enfants et nourrissons.',
    photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    nom: 'Dr. Alain Prost',
    specialite: 'Généraliste',
    bio: 'Médecin de famille pour tous les âges.',
    photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

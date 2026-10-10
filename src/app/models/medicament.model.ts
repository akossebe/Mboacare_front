export interface Medicament {
  idMedicament?: string;
  nom: string;
  forme: string;
  prix: number;
  idStock?: string;
  stockNom?: string;
  quantiteStock?: number;
  pharmaciNom?: string;
  pharmaciVille?: string;
  stock?: {
    idStock: string;
    nom: string;
    quantite: number;
  };
}
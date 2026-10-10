export interface Stock {
    idStock: string;
    nom: string;
    quantite: number;
    idPharmaci?: string;
    pharmaciNom?: string;
}

export interface StockReq {
    nom: string;
    quantite: number;
    idPharmaci: string;
}

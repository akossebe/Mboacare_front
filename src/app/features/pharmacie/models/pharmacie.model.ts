export interface Pharmacie {
    idPharmaci: string;
    nom: string;
    email: string;
    ville: string;
    quartier: string;
}

export interface PharmacieReq {
    nom: string;
    email: string;
    ville: string;
    quartier: string;
}

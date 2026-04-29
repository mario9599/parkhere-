// Posizione GPS
export type Posizione = {
  latitude: number;
  longitude: number;
};

// Parcheggio
export type Parcheggio = {
  id: string;
  nome: string;
  posizione: Posizione;
  indirizzo: string;
  valutazione: number;
  numeroRecensioni: number;
  gratuito: boolean;
  createdAt: string;
};

//recensione dell'utente
export type Recensione = {
  id: string;
  parcheggio_id: string;
  utente_id: string;
  nome_utente: string;
  testo: string;
  valutazione: number;
  createdAt: string;
  profili?: {
    nome_utente: string;
    avatar_url: string | null;
  };
};

// Parcheggio salvato dall'utente
export type ParcheggioSalvato = {
  id: string;
  posizione: Posizione;
  indirizzo: string;
  savedAt: string;
};

// Parcheggio salvato localmente sul dispositivo
export type ParcheggioLocale = {
  id: string;
  latitude: number;
  longitude: number;
  indirizzo: string;
  note: string;
  foto?: string; // opzionale
  savedAt: number; // timestamp in millisecondi
  scadeAlle: number; // timestamp quando si elimina automaticamente
  eliminaAlle: number;
};

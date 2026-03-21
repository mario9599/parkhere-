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

// Recensione
export type Recensione = {
  id: string;
  parcheggioId: string;
  utenteId: string;
  nomeUtente: string;
  testo: string;
  valutazione: number;
  createdAt: string;
};

// Parcheggio salvato dall'utente
export type ParcheggioSalvato = {
  id: string;
  posizione: Posizione;
  indirizzo: string;
  savedAt: string;
};

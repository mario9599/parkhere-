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
  parcheggioId: string;
  utente_id: string;
  nome_utente: string;
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

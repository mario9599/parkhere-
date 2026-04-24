import { useCallback, useEffect, useState } from "react";
import { calcolaDistanza, getParcheggi } from "../services/parcheggi";
import { getPosizione } from "../services/posizione";
import { Parcheggio } from "../types";

const RAGGIO_KM = 10; // mostra parcheggi entro 10 km

export const useParcheggi = () => {
  const [parcheggi, setParcheggi] = useState<Parcheggio[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  const caricaParcheggi = useCallback(async () => {
    try {
      setLoading(true);
      setErrore(null);

      // Carica tutti i parcheggi
      const tutti = await getParcheggi();

      // Prova a ottenere la posizione
      try {
        const { latitude, longitude } = await getPosizione();

        // Filtra solo i parcheggi entro il raggio
        const vicini = tutti.filter((p) => {
          const distanza = calcolaDistanza(
            latitude,
            longitude,
            p.latitude,
            p.longitude,
          );
          return distanza <= RAGGIO_KM;
        });

        // Ordina per distanza
        const ordinati = vicini.sort((a, b) => {
          const distA = calcolaDistanza(
            latitude,
            longitude,
            a.latitude,
            a.longitude,
          );
          const distB = calcolaDistanza(
            latitude,
            longitude,
            b.latitude,
            b.longitude,
          );
          return distA - distB;
        });

        setParcheggi(ordinati);
      } catch {
        // Se GPS non disponibile mostra tutti i parcheggi
        setParcheggi(tutti);
      }
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    caricaParcheggi();
  }, []);

  return { parcheggi, loading, errore, caricaParcheggi };
};

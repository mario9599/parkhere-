import { useCallback, useEffect, useState } from "react";
import {
  eliminaParcheggioSalvato,
  getParcheggioSalvato,
  prolungaParcheggio,
  salvaParcheggio,
  tempoRimanente,
} from "../services/parcheggioLocale";
import { ParcheggioLocale } from "../types";

export const useParcheggioLocale = () => {
  const [parcheggio, setParcheggio] = useState<ParcheggioLocale | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempo, setTempo] = useState({
    ore: 0,
    minuti: 0,
    secondi: 0,
    totaleMs: 0,
  });

  const carica = useCallback(async () => {
    const data = await getParcheggioSalvato();
    setParcheggio(data);
    if (data) setTempo(tempoRimanente(data.scadeAlle));
    setLoading(false);
  }, []);

  const salva = async (
    latitude: number,
    longitude: number,
    indirizzo: string,
    note: string,
    durataMinuti: number,
    foto?: string,
  ) => {
    await salvaParcheggio(
      latitude,
      longitude,
      indirizzo,
      note,
      durataMinuti,
      foto,
    );
    await carica();
  };

  const elimina = async () => {
    await eliminaParcheggioSalvato();
    setParcheggio(null);
    setTempo({ ore: 0, minuti: 0, secondi: 0, totaleMs: 0 });
  };

  useEffect(() => {
    carica();
  }, []);

  // Timer — aggiorna ogni secondo
  useEffect(() => {
    if (!parcheggio) return;

    const intervallo = setInterval(async () => {
      const t = tempoRimanente(parcheggio.scadeAlle);
      setTempo(t);

      // Se scaduto elimina automaticamente
      if (t.totaleMs <= 0) {
        setTempo({ ore: 0, minuti: 0, secondi: 0, totaleMs: 0 });
        // Non chiamare elimina() — ci pensa getParcheggioSalvato()
        // che controlla eliminaAlle (10 min dopo la scadenza)
        clearInterval(intervallo);
      }
    }, 1000); // ogni secondo

    return () => clearInterval(intervallo);
  }, [parcheggio]);

  const prolunga = async (minutiExtra: number) => {
    await prolungaParcheggio(minutiExtra);
    await carica();
  };

  return { parcheggio, loading, tempo, salva, elimina, carica, prolunga };
};

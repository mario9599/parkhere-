import { useEffect, useState } from "react";
import { getParcheggi } from "../services/parcheggi";
import { Parcheggio } from "../types";

export const useParcheggi = () => {
  const [parcheggi, setParcheggi] = useState<Parcheggio[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);

  const caricaParcheggi = async () => {
    try {
      setLoading(true);
      setErrore(null);
      const data = await getParcheggi();
      setParcheggi(data);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    caricaParcheggi();
  }, []);

  return { parcheggi, loading, errore, caricaParcheggi };
};

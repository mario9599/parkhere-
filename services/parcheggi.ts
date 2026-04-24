import { Parcheggio, Recensione } from "@/types";
import { supabase } from "./supabase";

//recupera i parcheggi

export const getParcheggi = async (): Promise<Parcheggio[]> => {
  const { data, error } = await supabase.from("parcheggi").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const getRecensioni = async (
  parcheggioId: string,
): Promise<Recensione[]> => {
  const { data, error } = await supabase
    .from("recensioni")
    .select("*")
    .eq("parcheggio_id", parcheggioId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const aggiungiRecensioni = async (
  recensione: Omit<Recensione, "id" | "createdAt">,
): Promise<void> => {
  // Recupera l'utente corrente
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    throw new Error("Devi essere autenticato per lasciare una recensione");

  const { error } = await supabase.from("recensioni").insert({
    ...recensione,
    utente_id: user.id, // ← salva l'id dell'utente
  });

  if (error) throw new Error(error.message);
};

export const aggiungiParcheggio = async (
  parcheggio: Omit<Parcheggio, "id" | "createdAt">,
): Promise<void> => {
  const { error } = await supabase.from("parcheggi").insert(parcheggio);
  if (error) throw new Error(error.message);
};

// Elimina una recensione — solo l'autore può eliminarla
export const eliminaRecensione = async (
  recensioneId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("recensioni")
    .delete()
    .eq("id", recensioneId);

  if (error) throw new Error(error.message);
};
// Controlla se esiste già un parcheggio nelle vicinanze (raggio 50 metri)
export const esisteParcheggioVicino = async (
  latitude: number,
  longitude: number,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("parcheggi")
    .select("id, latitude, longitude");

  if (error) throw new Error(error.message);

  // Calcola la distanza in metri tra due coordinate
  const distanza = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371000; // raggio della terra in metri
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Controlla se qualche parcheggio è entro 50 metri
  return data.some(
    (p) => distanza(latitude, longitude, p.latitude, p.longitude) < 50,
  );
};

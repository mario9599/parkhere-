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

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
  const { error } = await supabase.from("recensioni").insert(recensione);
  if (error) throw new Error(error.message);
};

export const aggiungiParcheggio = async (
  parcheggio: Omit<Parcheggio, "id" | "createdAt">,
): Promise<void> => {
  const { error } = await supabase.from("parcheggi").insert(parcheggio);
  if (error) throw new Error(error.message);
};

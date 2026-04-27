import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";

// Recupera il profilo utente
export const getProfilo = async (userId: string) => {
  const { data, error } = await supabase
    .from("profili")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Controlla se è passati 90 giorni dall'ultima modifica
export const puoModificare = (ultimaModifica: string | null): boolean => {
  if (!ultimaModifica) return true;
  const giorni90 = 90 * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(ultimaModifica).getTime() > giorni90;
};

// Calcola i giorni rimanenti prima di poter modificare
export const giorniRimanenti = (ultimaModifica: string | null): number => {
  if (!ultimaModifica) return 0;
  const giorni90 = 90 * 24 * 60 * 60 * 1000;
  const msRimanenti =
    giorni90 - (Date.now() - new Date(ultimaModifica).getTime());
  return Math.max(0, Math.ceil(msRimanenti / (24 * 60 * 60 * 1000)));
};

// Aggiorna il nome utente
export const aggiornaNomeUtente = async (
  userId: string,
  nomeUtente: string,
) => {
  // Aggiorna il profilo
  const { error } = await supabase
    .from("profili")
    .update({
      nome_utente: nomeUtente,
      ultima_modifica_nome: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  // Aggiorna anche i metadata utente
  const { error: authError } = await supabase.auth.updateUser({
    data: { nome_utente: nomeUtente },
  });

  if (authError) throw new Error(authError.message);
};

// Aggiorna l'email
export const aggiornaEmail = async (nuovaEmail: string) => {
  const { error } = await supabase.auth.updateUser({
    email: nuovaEmail,
  });
  if (error) throw new Error(error.message);

  // Aggiorna la data modifica email nel profilo
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profili")
      .update({ ultima_modifica_email: new Date().toISOString() })
      .eq("id", user.id);
  }
};

// Seleziona e carica la foto profilo
export const caricaFotoProfilo = async (userId: string): Promise<string> => {
  // Chiede il permesso
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permesso galleria negato");
  }

  // Apre la galleria
  const risultato = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (risultato.canceled) throw new Error("Operazione annullata");

  const uri = risultato.assets[0].uri;
  const fileExt = uri.split(".").pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  // Legge il file
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Carica su Supabase Storage
  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, decode(base64), {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

  if (error) throw new Error(error.message);

  // Recupera l'URL pubblico
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Salva l'URL nel profilo
  await supabase
    .from("profili")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);

  return data.publicUrl;
};

// Decodifica base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

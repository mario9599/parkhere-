import { supabase } from "./supabase";

// validazione email

const isEmailValida = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

//validazione password
const isPasswordValida = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const registra = async (
  email: string,
  password: string,
  nomeUtente: string,
) => {
  if (!email || !password || !nomeUtente) {
    throw new Error("Tutti i campi sono obbligatori !");
  }
  if (!isEmailValida(email)) {
    throw new Error("Email non valida !");
  }
  if (!isPasswordValida(password)) {
    throw new Error(
      "La password deve avere almeno 8 caratteri, una Maiuscola e un numero!",
    );
  }
  if (nomeUtente.trim().length < 3) {
    throw new Error("Il nome utente deve avere almeno 3 caratteri !");
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        nome_utente: nomeUtente.trim(),
      },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Errore durante la registrazione !");

  return data;
};

export const accedi = async (email: string, password: string) => {
  // Validazione input
  if (!email || !password) {
    throw new Error("Email e password sono obbligatori");
  }
  if (!isEmailValida(email)) {
    throw new Error("Email non valida");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) {
    // Messaggio di errore generico per non rivelare se l'email esiste
    throw new Error("Email o password non corretti");
  }
  if (!data.session) throw new Error("Errore durante il login");

  return data;
};

export const esci = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Errore durante il logout");
};

// Recupera utente corrente dalla sessione
export const getUtente = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
};

// Recupera sessione corrente
export const getSessione = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
};

// Controlla se l'utente è autenticato
export const isAutenticato = async (): Promise<boolean> => {
  const sessione = await getSessione();
  return !!sessione;
};

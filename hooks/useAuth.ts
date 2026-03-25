import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export const useAuth = () => {
  const [utente, setUtente] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è già una sessione attiva
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUtente(session?.user ?? null);
      setLoading(false);
    });

    // Ascolta i cambiamenti di sessione — login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUtente(session?.user ?? null);
    });

    // Cleanup — rimuove il listener quando il componente si smonta
    return () => subscription.unsubscribe();
  }, []);

  return { utente, loading };
};

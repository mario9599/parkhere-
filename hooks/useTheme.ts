import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "../constants/colors";

const CHIAVE_TEMA = "tema_preferito";

export type TipoTema = "light" | "dark" | "system";

export const useTheme = () => {
  const colorScheme = useColorScheme(); // tema del sistema
  const [temaPreferito, setTemaPreferito] = useState<TipoTema>("system");
  const [loading, setLoading] = useState(true);

  // Carica il tema salvato
  useEffect(() => {
    const caricaTema = async () => {
      try {
        const saved = await AsyncStorage.getItem(CHIAVE_TEMA);
        if (saved) setTemaPreferito(saved as TipoTema);
      } catch {
        // usa system di default
      } finally {
        setLoading(false);
      }
    };
    caricaTema();
  }, []);

  // Salva il tema scelto
  const impostaTema = async (tema: TipoTema) => {
    setTemaPreferito(tema);
    await AsyncStorage.setItem(CHIAVE_TEMA, tema);
  };

  // Calcola il tema attivo
  const temaAttivo = () => {
    if (temaPreferito === "system") {
      return colorScheme === "dark" ? "dark" : "light";
    }
    return temaPreferito;
  };

  const isDark = temaAttivo() === "dark";
  const Colors = isDark ? DarkTheme : LightTheme;

  return { Colors, isDark, temaPreferito, impostaTema, loading };
};

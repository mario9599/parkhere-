import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "../constants/colors";

type TipoTema = "light" | "dark" | "system";

type ThemeContextType = {
  Colors: typeof LightTheme;
  isDark: boolean;
  temaPreferito: TipoTema;
  impostaTema: (tema: TipoTema) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  Colors: LightTheme,
  isDark: false,
  temaPreferito: "system",
  impostaTema: async () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const [temaPreferito, setTemaPreferito] = useState<TipoTema>("system");

  useEffect(() => {
    const carica = async () => {
      const saved = await AsyncStorage.getItem("tema_preferito");
      if (saved) setTemaPreferito(saved as TipoTema);
    };
    carica();
  }, []);

  const impostaTema = async (tema: TipoTema) => {
    setTemaPreferito(tema);
    await AsyncStorage.setItem("tema_preferito", tema);
  };

  const isDark =
    temaPreferito === "system"
      ? colorScheme === "dark"
      : temaPreferito === "dark";

  const Colors = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider
      value={{ Colors, isDark, temaPreferito, impostaTema }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook per usare il tema ovunque
export const useTheme = () => useContext(ThemeContext);

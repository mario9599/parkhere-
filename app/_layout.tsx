import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppLayout() {
  const { Colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "🅿️ ParkApp" }} />
      <Stack.Screen
        name="dettaglio"
        options={{ title: "Dettaglio Parcheggio" }}
      />
      <Stack.Screen name="login" options={{ title: "Accedi" }} />
      <Stack.Screen name="registrazione" options={{ title: "Registrati" }} />
      <Stack.Screen
        name="aggiungi-parcheggio"
        options={{ title: "➕ Aggiungi Parcheggio" }}
      />
      <Stack.Screen
        name="parcheggio-salvato"
        options={{ title: "📍 Il mio parcheggio" }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function AppLayout() {
  const { Colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="dettaglio"
        options={{ title: "Dettaglio Parcheggio" }}
      />
      <Stack.Screen name="login" options={{ title: "Accedi" }} />
      <Stack.Screen name="registrazione" options={{ title: "Registrati" }} />
      <Stack.Screen
        name="aggiungi-parcheggio"
        options={{ title: "Aggiungi Parcheggio" }}
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

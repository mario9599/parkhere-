import { Stack } from "expo-router";
import { Colors } from "../constants/colors";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "ParkHere!" }} />
      <Stack.Screen
        name="dettaglio"
        options={{ title: "Dettaglio Parcheggio" }}
      />
      <Stack.Screen name="login" options={{ title: "Accedi" }} />
      <Stack.Screen name="registrazione" options={{ title: "Registrati" }} />
    </Stack>
  );
}

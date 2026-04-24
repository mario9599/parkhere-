import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Impostazioni() {
  const { Colors, isDark, temaPreferito, impostaTema } = useTheme();

  const opzioniTema = [
    { label: "☀️ Tema chiaro", valore: "light" },
    { label: "🌙 Tema scuro", valore: "dark" },
    { label: "📱 Segui sistema", valore: "system" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 24,
          color: Colors.textPrimary,
        }}
      >
        ⚙️ Impostazioni
      </Text>

      {/* Sezione tema */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 12,
          color: Colors.textSecondary,
        }}
      >
        ASPETTO
      </Text>

      <View
        style={{
          backgroundColor: Colors.surface,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {opzioniTema.map((opzione, index) => (
          <TouchableOpacity
            key={opzione.valore}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: index < opzioniTema.length - 1 ? 1 : 0,
              borderBottomColor: Colors.border,
            }}
            onPress={() =>
              impostaTema(opzione.valore as "light" | "dark" | "system")
            }
          >
            <Text style={{ fontSize: 16, color: Colors.textPrimary }}>
              {opzione.label}
            </Text>
            {temaPreferito === opzione.valore && (
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                ✓
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Info tema attivo */}
      <Text
        style={{
          fontSize: 14,
          color: Colors.textSecondary,
          textAlign: "center",
        }}
      >
        Tema attivo: {isDark ? "🌙 Scuro" : "☀️ Chiaro"}
      </Text>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { esci } from "../../services/auth";

export default function Impostazioni() {
  const { Colors, isDark, temaPreferito, impostaTema } = useTheme();
  const { utente } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await esci();
    router.replace("/");
  };

  const opzioniTema = [
    { label: "Tema chiaro", valore: "light", icona: "sunny-outline" },
    { label: "Tema scuro", valore: "dark", icona: "moon-outline" },
    {
      label: "Segui sistema",
      valore: "system",
      icona: "phone-portrait-outline",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: Colors.surface,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: Colors.primary,
            letterSpacing: -0.5,
          }}
        >
          ParkHere
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Profilo utente */}
        {utente ? (
          <View
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.primary + "20",
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={Colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: Colors.textPrimary,
                }}
              >
                {utente.user_metadata?.nome_utente || "Utente"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {utente.email}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 16,
              borderRadius: 16,
              alignItems: "center",
              marginBottom: 24,
            }}
            onPress={() => router.push("/login")}
          >
            <Text
              style={{ color: Colors.white, fontWeight: "700", fontSize: 15 }}
            >
              Accedi o Registrati
            </Text>
          </TouchableOpacity>
        )}

        {/* Sezione aspetto */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          ASPETTO
        </Text>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Ionicons
                  name={opzione.icona as any}
                  size={20}
                  color={Colors.textSecondary}
                />
                <Text style={{ fontSize: 15, color: Colors.textPrimary }}>
                  {opzione.label}
                </Text>
              </View>
              {temaPreferito === opzione.valore && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sezione account */}
        {utente && (
          <>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: Colors.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              ACCOUNT
            </Text>
            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                }}
                onPress={handleLogout}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={Colors.danger}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors.danger,
                      fontWeight: "600",
                    }}
                  >
                    Esci
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.danger}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Versione app */}
        <Text
          style={{
            fontSize: 12,
            color: Colors.textSecondary,
            textAlign: "center",
            marginTop: 32,
          }}
        >
          ParkHere v1.0.0
        </Text>
      </View>
    </View>
  );
}

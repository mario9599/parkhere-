import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { accedi } from "../services/auth";

export default function Login() {
  const { Colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [mostraPassword, setMostraPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrore(null);
      await accedi(email, password);
      router.dismissAll();
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.primary }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Sfondo colorato in alto */}
      <View
        style={{
          paddingTop: insets.top + 40,
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
            color: Colors.white,
            letterSpacing: -1,
          }}
        >
          ParkHere
        </Text>
        <Text
          style={{ fontSize: 16, color: Colors.white + "CC", marginTop: 4 }}
        >
          Bentornato
        </Text>
      </View>

      {/* Card bianca in basso */}
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 24,
          paddingTop: 32,
        }}
      >
        {/* Campo email */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          EMAIL
        </Text>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: Colors.border,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            marginBottom: 16,
          }}
        >
          <Ionicons
            name="mail-outline"
            size={18}
            color={Colors.textSecondary}
          />
          <TextInput
            style={{
              flex: 1,
              padding: 18,
              fontSize: 15,
              color: Colors.textPrimary,
              marginLeft: 8,
            }}
            placeholder="La tua mail"
            placeholderTextColor={Colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Campo password */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          PASSWORD
        </Text>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: Colors.border,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            marginBottom: 32,
          }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={Colors.textSecondary}
          />
          <TextInput
            style={{
              flex: 1,
              padding: 18,
              fontSize: 15,
              color: Colors.textPrimary,
              marginLeft: 8,
            }}
            placeholder="La tua password"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!mostraPassword}
          />
          <TouchableOpacity onPress={() => setMostraPassword(!mostraPassword)}>
            <Ionicons
              name={mostraPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Errore */}
        {errore && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              backgroundColor: Colors.danger + "15",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={Colors.danger}
            />
            <Text style={{ color: Colors.danger, fontSize: 14, flex: 1 }}>
              {errore}
            </Text>
          </View>
        )}

        {/* Bottone login */}
        <TouchableOpacity
          style={{
            backgroundColor: loading ? Colors.surfaceAlt : Colors.primary,
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            marginBottom: 16,
            shadowColor: Colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text
              style={{ color: Colors.white, fontWeight: "700", fontSize: 16 }}
            >
              Accedi
            </Text>
          )}
        </TouchableOpacity>

        {/* Link registrazione */}
        <TouchableOpacity
          style={{ alignItems: "center", padding: 8 }}
          onPress={() => router.push("/registrazione")}
        >
          <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
            Non hai un account?{" "}
            <Text style={{ color: Colors.primary, fontWeight: "700" }}>
              Registrati
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

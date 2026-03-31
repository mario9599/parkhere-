import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors";
import { accedi } from "../services/auth";

export default function Login() {
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
      router.replace("/");
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: Colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 8,
          color: Colors.primary,
        }}
      >
        Bentornato! 👋
      </Text>
      <Text style={{ fontSize: 16, color: Colors.gray, marginBottom: 32 }}>
        Accedi per lasciare recensioni
      </Text>

      {/* Campo email */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 6,
          color: Colors.black,
        }}
      >
        Email
      </Text>
      <TextInput
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.lightGray,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16,
        }}
        placeholder="mario@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo password */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 6,
          color: Colors.black,
        }}
      >
        Password
      </Text>
      <View style={{ position: "relative", marginBottom: 24 }}>
        <TextInput
          style={{
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.lightGray,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            paddingRight: 50,
          }}
          placeholder="La tua password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostraPassword}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 12, top: 12 }}
          onPress={() => setMostraPassword(!mostraPassword)}
        >
          <Text style={{ fontSize: 20 }}>{mostraPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      {/* Errore */}
      {errore && (
        <Text
          style={{
            color: Colors.danger,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          ❌ {errore}
        </Text>
      )}

      {/* Bottone login */}
      <TouchableOpacity
        style={{
          backgroundColor: loading ? Colors.gray : Colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text
            style={{ color: Colors.white, fontWeight: "bold", fontSize: 16 }}
          >
            Accedi
          </Text>
        )}
      </TouchableOpacity>

      {/* Link registrazione */}
      <TouchableOpacity onPress={() => router.push("/registrazione")}>
        <Text style={{ textAlign: "center", color: Colors.primary }}>
          Non hai un account? Registrati
        </Text>
      </TouchableOpacity>
    </View>
  );
}

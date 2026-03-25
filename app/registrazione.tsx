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
import { registra } from "../services/auth";

export default function Registrazione() {
  const [nomeUtente, setNomeUtente] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const handleRegistrazione = async () => {
    try {
      setLoading(true);
      setErrore(null);

      // Controlla che le password coincidano
      if (password !== confermaPassword) {
        throw new Error("Le password non coincidono");
      }

      await registra(email, password, nomeUtente);
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
        Crea account 🚀
      </Text>
      <Text style={{ fontSize: 16, color: Colors.gray, marginBottom: 32 }}>
        Registrati per lasciare recensioni
      </Text>

      {/* Campo nome utente */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 6,
          color: Colors.black,
        }}
      >
        Nome utente
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
        placeholder="Il tuo nome"
        value={nomeUtente}
        onChangeText={setNomeUtente}
        autoCapitalize="words"
      />

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
        placeholder="Minimo 8 caratteri, una maiuscola, un numero"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Campo conferma password */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          marginBottom: 6,
          color: Colors.black,
        }}
      >
        Conferma password
      </Text>
      <TextInput
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.lightGray,
          borderRadius: 8,
          padding: 12,
          marginBottom: 24,
          fontSize: 16,
        }}
        placeholder="Ripeti la password"
        value={confermaPassword}
        onChangeText={setConfermaPassword}
        secureTextEntry
      />

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

      {/* Bottone registrazione */}
      <TouchableOpacity
        style={{
          backgroundColor: loading ? Colors.gray : Colors.primary,
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
        onPress={handleRegistrazione}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text
            style={{ color: Colors.white, fontWeight: "bold", fontSize: 16 }}
          >
            Registrati
          </Text>
        )}
      </TouchableOpacity>

      {/* Link login */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={{ textAlign: "center", color: Colors.primary }}>
          Hai già un account? Accedi
        </Text>
      </TouchableOpacity>
    </View>
  );
}

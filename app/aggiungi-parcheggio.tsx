import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/colors";
import { aggiungiParcheggio } from "../services/parcheggi";

export default function AggiungiParcheggio() {
  const [nome, setNome] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [gratuito, setGratuito] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const handleAggiungi = async () => {
    // Validazione
    if (!nome.trim()) {
      setErrore("Il nome è obbligatorio");
      return;
    }
    if (!indirizzo.trim()) {
      setErrore("L'indirizzo è obbligatorio");
      return;
    }
    if (!latitude.trim() || !longitude.trim()) {
      setErrore("Le coordinate sono obbligatorie");
      return;
    }
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      setErrore("Le coordinate devono essere numeri validi");
      return;
    }

    try {
      setLoading(true);
      setErrore(null);
      await aggiungiParcheggio({
        nome: nome.trim(),
        indirizzo: indirizzo.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        gratuito,
        valutazione: 0,
        numero_recensioni: 0,
      });

      // Successo
      if (Platform.OS === "web") {
        window.alert("Parcheggio aggiunto con successo! ✅");
        router.replace("/");
      } else {
        Alert.alert("Successo! ✅", "Parcheggio aggiunto con successo!", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      }
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 24,
            color: Colors.black,
          }}
        >
          ➕ Nuovo Parcheggio
        </Text>

        {/* Nome */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 6,
            color: Colors.black,
          }}
        >
          Nome parcheggio *
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
          placeholder="Es. Parcheggio Via Roma"
          value={nome}
          onChangeText={setNome}
        />

        {/* Indirizzo */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 6,
            color: Colors.black,
          }}
        >
          Indirizzo *
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
          placeholder="Es. Via Roma 1, Milano"
          value={indirizzo}
          onChangeText={setIndirizzo}
        />

        {/* Coordinate */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 6,
            color: Colors.black,
          }}
        >
          Coordinate GPS *
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: Colors.lightGray,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Latitudine"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={{
              flex: 1,
              backgroundColor: Colors.white,
              borderWidth: 1,
              borderColor: Colors.lightGray,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Longitudine"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Gratuito/Pagamento */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 8,
            color: Colors.black,
          }}
        >
          Tipo parcheggio *
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: gratuito ? Colors.secondary : Colors.lightGray,
            }}
            onPress={() => setGratuito(true)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: gratuito ? Colors.white : Colors.gray,
              }}
            >
              Gratuito
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: !gratuito ? Colors.danger : Colors.lightGray,
            }}
            onPress={() => setGratuito(false)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: !gratuito ? Colors.white : Colors.gray,
              }}
            >
              A pagamento
            </Text>
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

        {/* Bottone aggiungi */}
        <TouchableOpacity
          style={{
            backgroundColor: loading ? Colors.gray : Colors.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleAggiungi}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text
              style={{ color: Colors.white, fontWeight: "bold", fontSize: 16 }}
            >
              Aggiungi Parcheggio
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

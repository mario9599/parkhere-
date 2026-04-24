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
import {
  aggiungiParcheggio,
  esisteParcheggioVicino,
} from "../services/parcheggi";
import { getPosizioneConIndirizzo } from "../services/posizione";

export default function AggiungiParcheggio() {
  const [nome, setNome] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gratuito, setGratuito] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingPosizione, setLoadingPosizione] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  // Prende la posizione GPS automaticamente
  const handlePrendiPosizione = async () => {
    try {
      setLoadingPosizione(true);
      setErrore(null);
      const { latitude, longitude, indirizzo } =
        await getPosizioneConIndirizzo();
      setLatitude(latitude);
      setLongitude(longitude);
      setIndirizzo(indirizzo);

      // Imposta automaticamente il nome con l'indirizzo rilevato
      if (!nome.trim()) {
        setNome(`Parcheggio ${indirizzo}`);
      }
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoadingPosizione(false);
    }
  };

  const handleAggiungi = async () => {
    if (!nome.trim()) {
      setErrore("Il nome è obbligatorio");
      return;
    }
    if (!latitude || !longitude) {
      setErrore("Devi rilevare la posizione GPS");
      return;
    }

    try {
      setLoading(true);
      setErrore(null);

      // ✅ Controlla se esiste già un parcheggio nelle vicinanze
      const esiste = await esisteParcheggioVicino(latitude, longitude);
      if (esiste) {
        setErrore(
          "Esiste già un parcheggio in questa zona — non puoi aggiungerne un altro a meno di 50 metri",
        );
        return;
      }

      await aggiungiParcheggio({
        nome: nome.trim(),
        indirizzo: indirizzo.trim(),
        latitude,
        longitude,
        gratuito,
        valutazione: 0,
        numero_recensioni: 0,
      });

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

        {/* Posizione GPS */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 6,
            color: Colors.black,
          }}
        >
          Posizione *
        </Text>

        {/* Bottone rileva posizione */}
        <TouchableOpacity
          style={{
            backgroundColor: loadingPosizione ? Colors.gray : Colors.primary,
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
          onPress={handlePrendiPosizione}
          disabled={loadingPosizione}
        >
          {loadingPosizione ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={{ color: Colors.white, fontWeight: "bold" }}>
              📍 {latitude ? "Aggiorna posizione" : "Rileva posizione GPS"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Mostra indirizzo rilevato */}
        {latitude && longitude && (
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: Colors.secondary,
            }}
          >
            <Text style={{ fontSize: 14, color: Colors.black }}>
              📍 {indirizzo}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.gray, marginTop: 4 }}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </View>
        )}

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

import { Ionicons } from "@expo/vector-icons";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import {
  aggiungiParcheggio,
  esisteParcheggioVicino,
} from "../services/parcheggi";
import { getPosizioneConIndirizzo } from "../services/posizione";

export default function AggiungiParcheggio() {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gratuito, setGratuito] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingPosizione, setLoadingPosizione] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const handlePrendiPosizione = async () => {
    try {
      setLoadingPosizione(true);
      setErrore(null);
      const { latitude, longitude, indirizzo } =
        await getPosizioneConIndirizzo();
      setLatitude(latitude);
      setLongitude(longitude);
      setIndirizzo(indirizzo);
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
        window.alert("Parcheggio aggiunto con successo!");
        router.replace("/");
      } else {
        Alert.alert("Successo!", "Parcheggio aggiunto con successo!", [
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
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      {/* Header colorato */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
      >
        {/* Bottone indietro */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 16,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.white} />
          <Text
            style={{ color: Colors.white, fontSize: 15, fontWeight: "600" }}
          >
            Indietro
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: Colors.white,
            letterSpacing: -0.5,
          }}
        >
          Nuovo Parcheggio
        </Text>
        <Text
          style={{ fontSize: 14, color: Colors.white + "CC", marginTop: 4 }}
        >
          Aggiungi un parcheggio alla community
        </Text>
      </View>

      {/* Card bianca */}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        contentContainerStyle={{ padding: 24, paddingTop: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Nome parcheggio */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          NOME PARCHEGGIO
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
            marginBottom: 20,
          }}
        >
          <Ionicons name="car-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={{
              flex: 1,
              padding: 18,
              fontSize: 15,
              color: Colors.textPrimary,
              marginLeft: 8,
            }}
            placeholder="Es. Parcheggio Via Roma"
            placeholderTextColor={Colors.textSecondary}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Posizione GPS */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          POSIZIONE
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: loadingPosizione
              ? Colors.surfaceAlt
              : Colors.primary,
            padding: 16,
            borderRadius: 14,
            marginBottom: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
          onPress={handlePrendiPosizione}
          disabled={loadingPosizione}
        >
          {loadingPosizione ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <>
              <Ionicons name="locate-outline" size={18} color={Colors.white} />
              <Text style={{ color: Colors.white, fontWeight: "700" }}>
                {latitude ? "Aggiorna posizione GPS" : "Rileva posizione GPS"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Indirizzo rilevato */}
        {latitude && longitude && (
          <View
            style={{
              backgroundColor: Colors.secondary + "15",
              padding: 12,
              borderRadius: 12,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Colors.secondary}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.textPrimary,
                  fontWeight: "600",
                }}
              >
                {indirizzo}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: Colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}

        {/* Tipo parcheggio */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          TIPO PARCHEGGIO
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 28 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              backgroundColor: gratuito ? Colors.secondary : Colors.surface,
              borderWidth: 2,
              borderColor: gratuito ? Colors.secondary : Colors.border,
            }}
            onPress={() => setGratuito(true)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={gratuito ? Colors.white : Colors.textSecondary}
            />
            <Text
              style={{
                fontWeight: "700",
                color: gratuito ? Colors.white : Colors.textSecondary,
              }}
            >
              Gratuito
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              backgroundColor: !gratuito ? Colors.danger : Colors.surface,
              borderWidth: 2,
              borderColor: !gratuito ? Colors.danger : Colors.border,
            }}
            onPress={() => setGratuito(false)}
          >
            <Ionicons
              name="card-outline"
              size={18}
              color={!gratuito ? Colors.white : Colors.textSecondary}
            />
            <Text
              style={{
                fontWeight: "700",
                color: !gratuito ? Colors.white : Colors.textSecondary,
              }}
            >
              A pagamento
            </Text>
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

        {/* Bottone aggiungi */}
        <TouchableOpacity
          style={{
            backgroundColor: loading ? Colors.surfaceAlt : Colors.primary,
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            shadowColor: Colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
          onPress={handleAggiungi}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={Colors.white}
              />
              <Text
                style={{ color: Colors.white, fontWeight: "700", fontSize: 16 }}
              >
                Aggiungi Parcheggio
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

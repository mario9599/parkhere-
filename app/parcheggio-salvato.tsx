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
import { useParcheggioLocale } from "../hooks/useParcheggioLocale";

const DURATE = [
  { label: "10 min", valore: 10 },
  { label: "30 min", valore: 30 },
  { label: "1 ora", valore: 60 },
  { label: "2 ore", valore: 120 },
  { label: "3 ore", valore: 180 },
  { label: "5 ore", valore: 300 },
];

export default function ParcheggioSalvato() {
  const { parcheggio, loading, tempo, salva, elimina } = useParcheggioLocale();
  const [mostraDettaglio, setMostraDettaglio] = useState(false);
  const [indirizzo, setIndirizzo] = useState("");
  const [note, setNote] = useState("");
  const [durata, setDurata] = useState(60);
  const [salvando, setSalvando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const coloreTimer = () => {
    if (tempo.totaleMs <= 5 * 60 * 1000) return Colors.danger;
    if (tempo.totaleMs <= 30 * 60 * 1000) return Colors.warning;
    return Colors.secondary;
  };

  const isScaduto = tempo.totaleMs <= 0;

  const handleSalva = async () => {
    if (!indirizzo.trim()) {
      setErrore("L'indirizzo è obbligatorio");
      return;
    }
    try {
      setSalvando(true);
      setErrore(null);
      await salva(45.4654, 9.1859, indirizzo.trim(), note.trim(), durata);
      setIndirizzo("");
      setNote("");
    } catch (err) {
      setErrore(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleElimina = () => {
    if (Platform.OS === "web") {
      const conferma = window.confirm("Vuoi annullare il parcheggio?");
      if (conferma) {
        elimina();
        setMostraDettaglio(false);
      }
    } else {
      Alert.alert(
        "Annulla parcheggio",
        "Vuoi annullare il parcheggio salvato?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sì, annulla",
            style: "destructive",
            onPress: () => {
              elimina();
              setMostraDettaglio(false);
            },
          },
        ],
      );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Schermata dettaglio parcheggio
  if (parcheggio && mostraDettaglio) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ padding: 16 }}>
          {/* Bottone torna indietro */}
          <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => setMostraDettaglio(false)}
          >
            <Text style={{ color: Colors.primary, fontSize: 16 }}>
              ← Torna indietro
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 16,
              color: Colors.black,
            }}
          >
            📍 Il mio parcheggio
          </Text>

          {/* Cronometro */}
          <View
            style={{
              backgroundColor: isScaduto ? Colors.danger : coloreTimer(),
              padding: 24,
              borderRadius: 16,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: Colors.white, fontSize: 14, marginBottom: 8 }}
            >
              {isScaduto ? "⚠️ Parcheggio scaduto" : "⏱️ Tempo rimanente"}
            </Text>
            <Text
              style={{ color: Colors.white, fontSize: 48, fontWeight: "bold" }}
            >
              {isScaduto
                ? "00:00:00"
                : `${pad(tempo.ore)}:${pad(tempo.minuti)}:${pad(tempo.secondi)}`}
            </Text>
            {isScaduto && (
              <Text style={{ color: Colors.white, fontSize: 12, marginTop: 8 }}>
                Verrà eliminato automaticamente tra 10 minuti
              </Text>
            )}
          </View>

          {/* Dettagli */}
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 4,
                color: Colors.black,
              }}
            >
              📍 {parcheggio.indirizzo}
            </Text>
            {parcheggio.note ? (
              <Text style={{ fontSize: 14, color: Colors.gray, marginTop: 8 }}>
                📝 {parcheggio.note}
              </Text>
            ) : null}
            <Text style={{ fontSize: 12, color: Colors.gray, marginTop: 8 }}>
              Salvato alle {new Date(parcheggio.savedAt).toLocaleTimeString()}
            </Text>
          </View>

          {/* Bottone annulla parcheggio */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.danger,
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleElimina}
          >
            <Text
              style={{ color: Colors.white, fontWeight: "bold", fontSize: 16 }}
            >
              🚗 Annulla parcheggio
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 16,
            color: Colors.black,
          }}
        >
          📍 Il mio parcheggio
        </Text>

        {parcheggio ? (
          // Card parcheggio salvato — clicca per il dettaglio
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: isScaduto ? Colors.danger : coloreTimer(),
            }}
            onPress={() => setMostraDettaglio(true)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors.black,
                  flex: 1,
                }}
              >
                📍 {parcheggio.indirizzo}
              </Text>
            </View>

            {/* Timer nella card */}
            <View
              style={{
                backgroundColor: isScaduto ? Colors.danger : coloreTimer(),
                padding: 8,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {isScaduto
                  ? "Scaduto ⚠️"
                  : `⏱️ ${pad(tempo.ore)}:${pad(tempo.minuti)}:${pad(tempo.secondi)}`}
              </Text>
            </View>

            {parcheggio.note ? (
              <Text style={{ fontSize: 14, color: Colors.gray }}>
                📝 {parcheggio.note}
              </Text>
            ) : null}

            <Text style={{ fontSize: 12, color: Colors.gray, marginTop: 4 }}>
              Tocca per i dettagli →
            </Text>
          </TouchableOpacity>
        ) : (
          // Form per salvare nuovo parcheggio
          <View>
            <Text
              style={{ fontSize: 14, color: Colors.gray, marginBottom: 24 }}
            >
              Nessun parcheggio salvato — salvane uno!
            </Text>

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

            {/* Note */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 6,
                color: Colors.black,
              }}
            >
              Note (opzionale)
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
                minHeight: 80,
              }}
              placeholder="Es. Piano -1, posto 42"
              value={note}
              onChangeText={setNote}
              multiline
            />

            {/* Selettore durata */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 8,
                color: Colors.black,
              }}
            >
              Per quanto tempo? *
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {DURATE.map((d) => (
                <TouchableOpacity
                  key={d.valore}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor:
                      durata === d.valore ? Colors.primary : Colors.lightGray,
                    backgroundColor:
                      durata === d.valore ? Colors.primary : Colors.white,
                  }}
                  onPress={() => setDurata(d.valore)}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: durata === d.valore ? Colors.white : Colors.gray,
                    }}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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

            <TouchableOpacity
              style={{
                backgroundColor: salvando ? Colors.gray : Colors.primary,
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={handleSalva}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  💾 Salva posizione
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

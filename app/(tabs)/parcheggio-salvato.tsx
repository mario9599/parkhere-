import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useParcheggioLocale } from "../../hooks/useParcheggioLocale";
import { getPosizioneConIndirizzo } from "../../services/posizione";

const DURATE = [
  { label: "1 min", valore: 1 },
  { label: "10 min", valore: 10 },
  { label: "30 min", valore: 30 },
  { label: "1 ora", valore: 60 },
  { label: "2 ore", valore: 120 },
  { label: "3 ore", valore: 180 },
  { label: "5 ore", valore: 300 },
];

const PROLUNGHE = [
  { label: "+15 min", valore: 15 },
  { label: "+30 min", valore: 30 },
  { label: "+1 ora", valore: 60 },
  { label: "+2 ore", valore: 120 },
];

export default function ParcheggioSalvato() {
  const { Colors } = useTheme();
  const { parcheggio, loading, tempo, salva, elimina, prolunga } =
    useParcheggioLocale();
  const insets = useSafeAreaInsets();
  const [mostraDettaglio, setMostraDettaglio] = useState(false);
  const [indirizzo, setIndirizzo] = useState("");
  const [note, setNote] = useState("");
  const [durata, setDurata] = useState(60);
  const [salvando, setSalvando] = useState(false);
  const [loadingPosizione, setLoadingPosizione] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [errore, setErrore] = useState<string | null>(null);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const isScaduto = tempo.totaleMs <= 0;

  const coloreTimer = () => {
    if (tempo.totaleMs <= 5 * 60 * 1000) return Colors.danger;
    if (tempo.totaleMs <= 30 * 60 * 1000) return Colors.warning;
    return Colors.secondary;
  };

  const handlePrendiPosizione = async () => {
    try {
      setLoadingPosizione(true);
      setErrore(null);
      const {
        latitude,
        longitude,
        indirizzo: indirizzoRilevato,
      } = await getPosizioneConIndirizzo();
      setLatitude(latitude);
      setLongitude(longitude);
      setIndirizzo(indirizzoRilevato);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoadingPosizione(false);
    }
  };

  const handleSalva = async () => {
    if (!latitude || !longitude) {
      setErrore("Devi rilevare la posizione GPS");
      return;
    }
    try {
      setSalvando(true);
      setErrore(null);
      await salva(latitude, longitude, indirizzo.trim(), note.trim(), durata);
      setIndirizzo("");
      setNote("");
      setLatitude(null);
      setLongitude(null);
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

  const handleProlunga = async (minuti: number, label: string) => {
    await prolunga(minuti);
    if (Platform.OS === "web") {
      window.alert(`Parcheggio prolungato di ${label}`);
    } else {
      Alert.alert("Prolungato!", `Parcheggio prolungato di ${label}`);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {parcheggio && mostraDettaglio ? (
          // Schermata dettaglio parcheggio
          <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                gap: 4,
              }}
              onPress={() => setMostraDettaglio(false)}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.primary} />
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                Torna indietro
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: Colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Il mio parcheggio
            </Text>
            {/* Mappa */}
            <MapView
              style={{
                width: "100%",
                height: 200,
                borderRadius: 16,
                marginBottom: 16,
              }}
              initialRegion={{
                latitude: parcheggio.latitude,
                longitude: parcheggio.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parcheggio.latitude,
                  longitude: parcheggio.longitude,
                }}
                title="Il mio parcheggio"
              />
            </MapView>

            {/* Cronometro */}
            <View
              style={{
                backgroundColor: isScaduto ? Colors.danger : coloreTimer(),
                padding: 24,
                borderRadius: 20,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 13,
                  marginBottom: 8,
                  fontWeight: "600",
                }}
              >
                {isScaduto ? "Parcheggio scaduto" : "Tempo rimanente"}
              </Text>
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 52,
                  fontWeight: "800",
                  letterSpacing: 2,
                }}
              >
                {isScaduto
                  ? "00:00:00"
                  : `${pad(tempo.ore)}:${pad(tempo.minuti)}:${pad(tempo.secondi)}`}
              </Text>
              {isScaduto && (
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 12,
                    marginTop: 8,
                    opacity: 0.8,
                  }}
                >
                  Verrà eliminato automaticamente tra 10 minuti
                </Text>
              )}
            </View>

            {/* Dettagli */}
            <View
              style={{
                backgroundColor: Colors.surface,
                padding: 16,
                borderRadius: 16,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: Colors.textPrimary,
                    flex: 1,
                  }}
                >
                  {parcheggio.indirizzo}
                </Text>
              </View>
              {parcheggio.note ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.textSecondary,
                      flex: 1,
                    }}
                  >
                    {parcheggio.note}
                  </Text>
                </View>
              ) : null}
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.textSecondary,
                  marginTop: 8,
                }}
              >
                Salvato alle {new Date(parcheggio.savedAt).toLocaleTimeString()}
              </Text>
            </View>

            {/* Prolunga */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: Colors.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              PROLUNGA PARCHEGGIO
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {PROLUNGHE.map((p) => (
                <TouchableOpacity
                  key={p.valore}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: Colors.primary + "15",
                    borderWidth: 1,
                    borderColor: Colors.primary + "30",
                  }}
                  onPress={() => handleProlunga(p.valore, p.label)}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottone annulla */}
            <TouchableOpacity
              style={{
                backgroundColor: Colors.danger,
                padding: 16,
                borderRadius: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={handleElimina}
            >
              <Ionicons name="car-outline" size={20} color={Colors.white} />
              <Text
                style={{ color: Colors.white, fontWeight: "700", fontSize: 16 }}
              >
                Ho ripreso la macchina
              </Text>
            </TouchableOpacity>
          </View>
        ) : parcheggio ? (
          // Card parcheggio salvato
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: Colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Il mio parcheggio
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.surface,
                padding: 16,
                borderRadius: 16,
                borderLeftWidth: 4,
                borderLeftColor: isScaduto ? Colors.danger : coloreTimer(),
                shadowColor: Colors.black,
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
              onPress={() => setMostraDettaglio(true)}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: Colors.textPrimary,
                    flex: 1,
                  }}
                >
                  {parcheggio.indirizzo}
                </Text>
              </View>

              {/* Timer */}
              <View
                style={{
                  backgroundColor: isScaduto ? Colors.danger : coloreTimer(),
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: "800",
                    fontSize: 20,
                    letterSpacing: 1,
                  }}
                >
                  {isScaduto
                    ? "Scaduto"
                    : `${pad(tempo.ore)}:${pad(tempo.minuti)}:${pad(tempo.secondi)}`}
                </Text>
              </View>

              {parcheggio.note ? (
                <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                  {parcheggio.note}
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                  Tocca per i dettagli
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={Colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          // Form salva parcheggio
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: Colors.textPrimary,
                marginBottom: 4,
              }}
            >
              Dove ho parcheggiato?
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                marginBottom: 24,
              }}
            >
              Salva la posizione — visibile solo a te
            </Text>

            {/* Bottone GPS */}
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
                padding: 14,
                borderRadius: 14,
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
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <>
                  <Ionicons
                    name="locate-outline"
                    size={18}
                    color={Colors.white}
                  />
                  <Text style={{ color: Colors.white, fontWeight: "700" }}>
                    {latitude ? "Aggiorna posizione" : "Rileva posizione GPS"}
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
                  marginBottom: 16,
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
                <Text
                  style={{ fontSize: 13, color: Colors.textPrimary, flex: 1 }}
                >
                  {indirizzo}
                </Text>
              </View>
            )}

            {/* Note */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: Colors.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              NOTE (OPZIONALE)
            </Text>
            <View
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: Colors.border,
                marginBottom: 16,
              }}
            >
              <View style={{ padding: 12, minHeight: 80 }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: note ? Colors.textPrimary : Colors.textSecondary,
                  }}
                  onPress={() => {}}
                >
                  {note || "Es. Piano -1, posto 42..."}
                </Text>
              </View>
            </View>

            {/* Durata */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: Colors.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              PER QUANTO TEMPO?
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
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor:
                      durata === d.valore ? Colors.primary : Colors.border,
                    backgroundColor:
                      durata === d.valore ? Colors.primary : Colors.surface,
                  }}
                  onPress={() => setDurata(d.valore)}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 13,
                      color:
                        durata === d.valore
                          ? Colors.white
                          : Colors.textSecondary,
                    }}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {errore && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={Colors.danger}
                />
                <Text style={{ color: Colors.danger, fontSize: 14 }}>
                  {errore}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: salvando ? Colors.surfaceAlt : Colors.primary,
                padding: 16,
                borderRadius: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={handleSalva}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <>
                  <Ionicons
                    name="save-outline"
                    size={20}
                    color={Colors.white}
                  />
                  <Text
                    style={{
                      color: Colors.white,
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    Salva posizione
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import {
  aggiungiRecensioni,
  eliminaRecensione,
  getRecensioni,
} from "../services/parcheggi";
import { Recensione } from "../types";

export default function Dettaglio() {
  const { Colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id, nome, latitude, longitude } = useLocalSearchParams();
  const { utente } = useAuth();
  const [recensioni, setRecensioni] = useState<Recensione[]>([]);
  const [loading, setLoading] = useState(true);
  const [testo, setTesto] = useState("");
  const [valutazione, setValutazione] = useState(5);
  const [invio, setInvio] = useState(false);

  const caricaRecensioni = async () => {
    try {
      const data = await getRecensioni(id as string);
      setRecensioni(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    caricaRecensioni();
  }, []);

  const inviaRecensione = async () => {
    if (testo.trim() === "") return;
    try {
      setInvio(true);
      await aggiungiRecensioni({
        parcheggio_id: id as string,
        nome_utente:
          utente?.user_metadata?.nome_utente || utente?.email || "Utente",
        testo,
        valutazione,
      });
      setTesto("");
      caricaRecensioni();
    } catch (err) {
      console.log(err);
    } finally {
      setInvio(false);
    }
  };

  const handleEliminaRecensione = async (recensioneId: string) => {
    if (Platform.OS === "web") {
      const conferma = window.confirm(
        "Sei sicuro di voler eliminare questa recensione?",
      );
      if (conferma) {
        try {
          await eliminaRecensione(recensioneId);
          caricaRecensioni();
        } catch (err) {
          window.alert("Errore: " + err.message);
        }
      }
    } else {
      Alert.alert(
        "Elimina recensione",
        "Sei sicuro di voler eliminare questa recensione?",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Elimina",
            style: "destructive",
            onPress: async () => {
              try {
                await eliminaRecensione(recensioneId);
                caricaRecensioni();
              } catch (err) {
                Alert.alert("Errore", err.message);
              }
            },
          },
        ],
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      {/* Header colorato */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {/* Bottone indietro */}
        {/*<TouchableOpacity
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
        </TouchableOpacity> */}

        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: Colors.white,
            letterSpacing: -0.5,
          }}
        >
          {nome}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 4,
          }}
        >
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.white + "CC"}
          />
          <Text style={{ fontSize: 13, color: Colors.white + "CC" }}>
            Visualizza posizione sulla mappa
          </Text>
        </View>
      </View>

      {/* Card bianca */}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mappa */}
        <MapView
          style={{
            width: "100%",
            height: 220,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
          initialRegion={{
            latitude: parseFloat(latitude as string),
            longitude: parseFloat(longitude as string),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(latitude as string),
              longitude: parseFloat(longitude as string),
            }}
            title={nome as string}
          />
        </MapView>

        <View style={{ padding: 16 }}>
          {/* Form recensione */}
          {utente ? (
            <View
              style={{
                backgroundColor: Colors.surface,
                padding: 16,
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: Colors.textPrimary,
                  marginBottom: 12,
                }}
              >
                Lascia una recensione
              </Text>

              {/* Stelle */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <TouchableOpacity key={v} onPress={() => setValutazione(v)}>
                    <Ionicons
                      name={v <= valutazione ? "star" : "star-outline"}
                      size={28}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={{
                  backgroundColor: Colors.surfaceAlt,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  minHeight: 80,
                  fontSize: 15,
                  color: Colors.textPrimary,
                  textAlignVertical: "top",
                }}
                placeholder="Scrivi la tua recensione..."
                placeholderTextColor={Colors.textSecondary}
                value={testo}
                onChangeText={setTesto}
                multiline
              />

              <TouchableOpacity
                style={{
                  backgroundColor: invio ? Colors.surfaceAlt : Colors.primary,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
                onPress={async () => {
                  await inviaRecensione();
                  router.dismissAll();
                }}
                disabled={invio}
              >
                {invio ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <>
                    <Ionicons
                      name="send-outline"
                      size={16}
                      color={Colors.white}
                    />
                    <Text style={{ color: Colors.white, fontWeight: "700" }}>
                      Invia recensione
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary + "15",
                padding: 16,
                borderRadius: 16,
                marginBottom: 24,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                borderWidth: 1,
                borderColor: Colors.primary + "30",
              }}
              onPress={() => router.push("/login")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={{ color: Colors.primary, fontWeight: "700" }}>
                Accedi per lasciare una recensione
              </Text>
            </TouchableOpacity>
          )}

          {/* Sezione recensioni */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: Colors.textSecondary,
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            RECENSIONI
          </Text>

          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : recensioni.length === 0 ? (
            <View style={{ alignItems: "center", padding: 24 }}>
              <Ionicons
                name="chatbubble-outline"
                size={40}
                color={Colors.textSecondary}
              />
              <Text
                style={{
                  color: Colors.textSecondary,
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                Nessuna recensione ancora — sii il primo!
              </Text>
            </View>
          ) : (
            <FlatList
              data={recensioni}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: Colors.surface,
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: Colors.primary + "20",
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: Colors.primary,
                          }}
                        >
                          {item.nome_utente.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: Colors.textPrimary,
                          fontSize: 14,
                        }}
                      >
                        {item.nome_utente}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Ionicons
                          key={v}
                          name={v <= item.valutazione ? "star" : "star-outline"}
                          size={14}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                  </View>

                  <Text
                    style={{
                      color: Colors.textSecondary,
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {item.testo}
                  </Text>

                  {utente && utente.id === item.utente_id && (
                    <TouchableOpacity
                      style={{
                        alignSelf: "flex-end",
                        marginTop: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: Colors.danger + "15",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                      onPress={() => handleEliminaRecensione(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color={Colors.danger}
                      />
                      <Text
                        style={{
                          color: Colors.danger,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Elimina
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

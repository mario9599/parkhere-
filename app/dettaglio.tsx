import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Colors } from "../constants/colors";
import { useAuth } from "../hooks/useAuth";
import {
  aggiungiRecensioni,
  eliminaRecensione,
  getRecensioni,
} from "../services/parcheggi";
import { Recensione } from "../types";

export default function Dettaglio() {
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

  // Chiede conferma prima di eliminare
  const handleEliminaRecensione = async (recensioneId: string) => {
    if (Platform.OS === "web") {
      // Sul web usa window.confirm
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
      // Su mobile usa Alert nativo
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
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          color: Colors.black,
        }}
      >
        {nome}
      </Text>

      {/* ← INSERISCI QUI LA MAPPA */}
      <MapView
        style={{
          width: "100%",
          height: 200,
          borderRadius: 12,
          marginBottom: 16,
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

      {/* Form recensione — solo per utenti autenticati */}
      {utente ? (
        <View
          style={{
            backgroundColor: Colors.white,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Lascia una recensione
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors.lightGray,
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              minHeight: 80,
            }}
            placeholder="Scrivi la tua recensione..."
            value={testo}
            onChangeText={setTesto}
            multiline
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((v) => (
                <TouchableOpacity key={v} onPress={() => setValutazione(v)}>
                  <Text style={{ fontSize: 24 }}>
                    {v <= valutazione ? "⭐" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: invio ? Colors.gray : Colors.primary,
                padding: 12,
                borderRadius: 8,
              }}
              onPress={async () => {
                await inviaRecensione();
                router.dismissAll();
              }}
              disabled={invio}
            >
              <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                {invio ? "Invio..." : "Invia"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Messaggio per utenti non autenticati
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: "center",
          }}
          onPress={() => router.push("/login")}
        >
          <Text style={{ color: Colors.white, fontWeight: "bold" }}>
            🔐 Accedi per lasciare una recensione
          </Text>
        </TouchableOpacity>
      )}

      {/* Lista recensioni */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : recensioni.length === 0 ? (
        <Text
          style={{ color: Colors.gray, textAlign: "center", marginTop: 16 }}
        >
          Nessuna recensione ancora — sii il primo! 🌟
        </Text>
      ) : (
        <FlatList
          data={recensioni}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: Colors.white,
                padding: 16,
                borderRadius: 12,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.nome_utente}</Text>
                <Text style={{ color: Colors.warning }}>
                  {"⭐".repeat(item.valutazione)}
                </Text>
              </View>
              <Text style={{ color: Colors.gray, marginBottom: 8 }}>
                {item.testo}
              </Text>

              {/* Bottone elimina — visibile solo all'autore */}
              {utente && utente.id === item.utente_id && (
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: Colors.danger,
                    padding: 6,
                    borderRadius: 6,
                  }}
                  onPress={() => handleEliminaRecensione(item.id)}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    🗑️ Elimina
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

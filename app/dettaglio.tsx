import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors";
import { aggiungiRecensioni, getRecensioni } from "../services/parcheggi";
import { Recensione } from "../types";

export default function Dettaglio() {
  const { id, nome } = useLocalSearchParams();
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
        nome_utente: "Utente",
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

      {/* Form recensione */}
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
              await inviaRecensione(); // aspetta che finisca
              router.dismissAll(); // poi torna alla home
            }}
            disabled={invio}
          >
            <Text style={{ color: Colors.white, fontWeight: "bold" }}>
              {invio ? "Invio..." : "Invia"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
              <Text style={{ color: Colors.gray }}>{item.testo}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

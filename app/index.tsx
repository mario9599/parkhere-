import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors";
import { useParcheggi } from "../hooks/useParcheggi";
import { Parcheggio } from "../types";

// Componente riutilizzabile — mostra la carta di un singolo parcheggio
// riceve il parcheggio come prop e una funzione onPress per la navigazione
function CartaParcheggio({
  parcheggio,
  onPress,
}: {
  parcheggio: Parcheggio;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // ombra su Android
      }}
      onPress={onPress}
    >
      {/* Riga superiore — nome e tipo (gratuito/pagamento) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.black }}>
          {parcheggio.nome}
        </Text>
        {/* Colore verde se gratuito, rosso se a pagamento */}
        <Text
          style={{
            fontSize: 16,
            color: parcheggio.gratuito ? Colors.secondary : Colors.danger,
          }}
        >
          {parcheggio.gratuito ? "Gratuito" : "A pagamento"}
        </Text>
      </View>

      {/* Indirizzo del parcheggio */}
      <Text style={{ fontSize: 14, color: Colors.gray, marginBottom: 8 }}>
        📍 {parcheggio.indirizzo}
      </Text>

      {/* Riga inferiore — valutazione e numero recensioni */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Mostra la valutazione media o "Nessuna valutazione" se è 0 */}
        <Text style={{ fontSize: 14, color: Colors.warning }}>
          ⭐{" "}
          {parcheggio.valutazione > 0
            ? parcheggio.valutazione.toFixed(1)
            : "Nessuna valutazione"}
        </Text>
        <Text style={{ fontSize: 14, color: Colors.gray }}>
          {parcheggio.numero_recensioni} recensioni
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Index() {
  const router = useRouter();

  // Hook personalizzato — gestisce il caricamento dei parcheggi da Supabase
  // restituisce: lista parcheggi, stato loading, errore, funzione per ricaricare
  const { parcheggi, loading, errore, caricaParcheggi } = useParcheggi();
  useFocusEffect(
    useCallback(() => {
      caricaParcheggi();
    }, []),
  );

  // Mostra lo spinner mentre i dati vengono caricati da Supabase
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 8, color: Colors.gray }}>
          Caricamento parcheggi...
        </Text>
      </View>
    );
  }

  // Mostra l'errore con un bottone "Riprova" se la chiamata API fallisce
  if (errore) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ color: Colors.danger, fontSize: 16, marginBottom: 16 }}>
          ❌ {errore}
        </Text>
        {/* Richiama caricaParcheggi per riprovare la chiamata API */}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 12,
            borderRadius: 8,
          }}
          onPress={caricaParcheggi}
        >
          <Text style={{ color: Colors.white, fontWeight: "bold" }}>
            Riprova
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Schermata principale — lista di tutti i parcheggi
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 16 }}>
      {/* Contatore parcheggi trovati */}
      <Text style={{ fontSize: 16, color: Colors.gray, marginBottom: 16 }}>
        {parcheggi.length} parcheggi trovati
      </Text>

      {/* FlatList — più performante di map per liste lunghe
          keyExtractor — usa l'id come chiave univoca per ogni elemento
          renderItem — renderizza CartaParcheggio per ogni parcheggio */}
      <FlatList
        data={parcheggi}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaParcheggio
            parcheggio={item}
            // Naviga alla schermata dettaglio passando id e nome del parcheggio
            onPress={() =>
              router.push(`/dettaglio?id=${item.id}&nome=${item.nome}`)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

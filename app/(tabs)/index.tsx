import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useParcheggi } from "../../hooks/useParcheggi";
import { esci } from "../../services/auth";
import { Parcheggio } from "../../types";

function CartaParcheggio({
  parcheggio,
  onPress,
  Colors,
}: {
  parcheggio: Parcheggio;
  onPress: () => void;
  Colors: any;
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: Colors.black,
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Riga superiore */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: Colors.textPrimary,
            flex: 1,
            marginRight: 8,
          }}
        >
          {parcheggio.nome}
        </Text>
        <View
          style={{
            backgroundColor: parcheggio.gratuito
              ? Colors.secondary + "20"
              : Colors.danger + "20",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: parcheggio.gratuito ? Colors.secondary : Colors.danger,
            }}
          >
            {parcheggio.gratuito ? "Gratuito" : "A pagamento"}
          </Text>
        </View>
      </View>

      {/* Indirizzo */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Ionicons
          name="location-outline"
          size={14}
          color={Colors.textSecondary}
        />
        <Text
          style={{ fontSize: 13, color: Colors.textSecondary, marginLeft: 4 }}
        >
          {parcheggio.indirizzo}
        </Text>
      </View>

      {/* Riga inferiore */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text
            style={{ fontSize: 13, color: Colors.textSecondary, marginLeft: 4 }}
          >
            {parcheggio.valutazione > 0
              ? parcheggio.valutazione.toFixed(1)
              : "Nessuna valutazione"}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
          {parcheggio.numero_recensioni} recensioni
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { parcheggi, loading, errore, caricaParcheggi } = useParcheggi();
  const { utente } = useAuth();
  const [ricerca, setRicerca] = useState("");
  const { Colors } = useTheme();

  const handleLogout = async () => {
    await esci();
    router.replace("/");
  };

  const parcheggiFiltrati = parcheggi.filter((p) =>
    p.nome.toLowerCase().includes(ricerca.toLowerCase()),
  );

  useFocusEffect(
    useCallback(() => {
      caricaParcheggi();
    }, []),
  );

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
        <Text
          style={{ marginTop: 12, color: Colors.textSecondary, fontSize: 14 }}
        >
          Caricamento parcheggi...
        </Text>
      </View>
    );
  }

  if (errore) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          backgroundColor: Colors.background,
        }}
      >
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text
          style={{
            color: Colors.danger,
            fontSize: 16,
            marginBottom: 16,
            marginTop: 8,
          }}
        >
          {errore}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 12,
            borderRadius: 12,
            paddingHorizontal: 24,
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: Colors.surface,
          paddingHorizontal: 16,
          paddingTop: insets.top + 8, // ← si adatta automaticamente
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        {/* Logo e azioni utente */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
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
          {!utente && (
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
              onPress={() => router.push("/login")}
            >
              <Text
                style={{ color: Colors.white, fontWeight: "600", fontSize: 13 }}
              >
                Accedi
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Barra di ricerca */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.surfaceAlt,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.textSecondary}
          />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 15,
              color: Colors.textPrimary,
            }}
            placeholder="Cerca parcheggio..."
            placeholderTextColor={Colors.textSecondary}
            value={ricerca}
            onChangeText={setRicerca}
          />
          {ricerca.length > 0 && (
            <TouchableOpacity onPress={() => setRicerca("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contatore */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text
          style={{
            fontSize: 13,
            color: Colors.textSecondary,
            fontWeight: "500",
          }}
        >
          {parcheggiFiltrati.length} parcheggi trovati
        </Text>
      </View>

      {/* Lista parcheggi */}
      <FlatList
        data={parcheggiFiltrati}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <CartaParcheggio
            parcheggio={item}
            Colors={Colors}
            onPress={() =>
              router.push(
                `/dettaglio?id=${item.id}&nome=${item.nome}&latitude=${item.latitude}&longitude=${item.longitude}`,
              )
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons
              name="map-outline"
              size={48}
              color={Colors.textSecondary}
            />
            <Text
              style={{
                color: Colors.textSecondary,
                marginTop: 12,
                fontSize: 15,
              }}
            >
              Nessun parcheggio trovato
            </Text>
          </View>
        }
      />

      {/* Bottone + flottante — solo per utenti autenticati */}
      {utente && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: Colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: Colors.primary,
            shadowOpacity: 0.4,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
          onPress={() => router.push("/aggiungi-parcheggio")}
        >
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

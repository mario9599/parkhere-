import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { esci } from "../../services/auth";
import { getProfilo } from "../../services/profilo";

export default function Impostazioni() {
  const { Colors, isDark, temaPreferito, impostaTema } = useTheme();
  const { utente } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profilo, setProfilo] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      if (utente) {
        getProfilo(utente.id).then(setProfilo).catch(console.log);
      }
    }, [utente]),
  );

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const conferma = window.confirm("Sei sicuro di voler uscire?");
      if (!conferma) return;
    } else {
      await new Promise((resolve) => {
        Alert.alert("Esci", "Sei sicuro di voler uscire?", [
          { text: "Annulla", style: "cancel", onPress: () => resolve(false) },
          { text: "Esci", style: "destructive", onPress: () => resolve(true) },
        ]);
      }).then(async (confermato) => {
        if (confermato) {
          await esci();
          router.replace("/");
        }
      });
      return;
    }
    await esci();
    router.replace("/");
  };

  const opzioniTema = [
    { label: "Tema chiaro", valore: "light", icona: "sunny-outline" },
    { label: "Tema scuro", valore: "dark", icona: "moon-outline" },
    {
      label: "Segui sistema",
      valore: "system",
      icona: "phone-portrait-outline",
    },
  ];

  const SezioneCard = ({ children }: { children: React.ReactNode }) => (
    <View
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      {children}
    </View>
  );

  const RigaImpostazione = ({
    icona,
    coloreIcona,
    titolo,
    sottotitolo,
    destra,
    onPress,
    ultimo = false,
  }: {
    icona: string;
    coloreIcona?: string;
    titolo: string;
    sottotitolo?: string;
    destra?: React.ReactNode;
    onPress?: () => void;
    ultimo?: boolean;
  }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: ultimo ? 0 : 1,
        borderBottomColor: Colors.border,
        gap: 12,
      }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={{
          backgroundColor: (coloreIcona || Colors.primary) + "15",
          width: 36,
          height: 36,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={icona as any}
          size={18}
          color={coloreIcona || Colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 15, color: Colors.textPrimary, fontWeight: "500" }}
        >
          {titolo}
        </Text>
        {sottotitolo && (
          <Text
            style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}
          >
            {sottotitolo}
          </Text>
        )}
      </View>
      {destra ||
        (onPress && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textSecondary}
          />
        ))}
    </TouchableOpacity>
  );

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
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: Colors.white,
            letterSpacing: -1,
          }}
        >
          ParkHere
        </Text>
        <Text
          style={{ fontSize: 14, color: Colors.white + "CC", marginTop: 4 }}
        >
          Impostazioni
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
        contentContainerStyle={{ padding: 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profilo */}
        {utente ? (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: 16,
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
            onPress={() => router.push("/profilo")}
          >
            {/* Avatar con foto */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                overflow: "hidden",
                backgroundColor: Colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {profilo?.avatar_url ? (
                <Image
                  source={{ uri: `${profilo.avatar_url}?t=${Date.now()}` }}
                  style={{ width: 56, height: 56 }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: Colors.white,
                  }}
                >
                  {(utente.user_metadata?.nome_utente || utente.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: Colors.textPrimary,
                }}
              >
                {profilo?.nome_utente ||
                  utente.user_metadata?.nome_utente ||
                  "Utente"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {utente.email}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              padding: 18,
              borderRadius: 16,
              alignItems: "center",
              marginBottom: 24,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            onPress={() => router.push("/login")}
          >
            <Ionicons name="person-outline" size={18} color={Colors.white} />
            <Text
              style={{ color: Colors.white, fontWeight: "700", fontSize: 15 }}
            >
              Accedi o Registrati
            </Text>
          </TouchableOpacity>
        )}

        {/* Aspetto */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          ASPETTO
        </Text>
        <SezioneCard>
          {opzioniTema.map((opzione, index) => (
            <RigaImpostazione
              key={opzione.valore}
              icona={opzione.icona}
              titolo={opzione.label}
              ultimo={index === opzioniTema.length - 1}
              onPress={() =>
                impostaTema(opzione.valore as "light" | "dark" | "system")
              }
              destra={
                temaPreferito === opzione.valore ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.primary}
                  />
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: Colors.border,
                    }}
                  />
                )
              }
            />
          ))}
        </SezioneCard>

        {/* Notifiche */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          NOTIFICHE
        </Text>
        <SezioneCard>
          <RigaImpostazione
            icona="notifications-outline"
            titolo="Notifiche parcheggio"
            sottotitolo="Avvisi scadenza parcheggio"
            onPress={() => {
              if (Platform.OS !== "web") Linking.openSettings();
            }}
          />
          <RigaImpostazione
            icona="alarm-outline"
            titolo="Promemoria scadenza"
            sottotitolo="10 minuti prima della scadenza"
            ultimo
            onPress={() => {
              if (Platform.OS !== "web") Linking.openSettings();
            }}
          />
        </SezioneCard>

        {/* Privacy */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          PRIVACY E SICUREZZA
        </Text>
        <SezioneCard>
          <RigaImpostazione
            icona="location-outline"
            titolo="Permessi posizione"
            sottotitolo="Necessario per trovare parcheggi vicini"
            onPress={() => {
              if (Platform.OS !== "web") Linking.openSettings();
            }}
          />
          <RigaImpostazione
            icona="shield-checkmark-outline"
            titolo="Privacy Policy"
            sottotitolo="Come utilizziamo i tuoi dati"
            onPress={() => Linking.openURL("https://parkhere.app/privacy")}
          />
          <RigaImpostazione
            icona="document-text-outline"
            titolo="Termini di servizio"
            ultimo
            onPress={() => Linking.openURL("https://parkhere.app/terms")}
          />
        </SezioneCard>

        {/* Supporto */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          SUPPORTO
        </Text>
        <SezioneCard>
          <RigaImpostazione
            icona="help-circle-outline"
            titolo="Centro assistenza"
            onPress={() => Linking.openURL("https://parkhere.app/help")}
          />
          <RigaImpostazione
            icona="chatbubble-outline"
            titolo="Contattaci"
            sottotitolo="support@parkhere.app"
            onPress={() => Linking.openURL("mailto:support@parkhere.app")}
          />
          <RigaImpostazione
            icona="star-outline"
            titolo="Valuta l'app"
            ultimo
            onPress={() => {
              if (Platform.OS !== "web")
                Linking.openURL("market://details?id=app.parkhere");
            }}
          />
        </SezioneCard>

        {/* Account */}
        {utente && (
          <>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: Colors.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              ACCOUNT
            </Text>
            <SezioneCard>
              <RigaImpostazione
                icona="log-out-outline"
                coloreIcona={Colors.danger}
                titolo="Esci"
                ultimo
                onPress={handleLogout}
              />
            </SezioneCard>
          </>
        )}

        {/* Versione */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              color: Colors.textSecondary,
              fontWeight: "600",
            }}
          >
            ParkHere
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}
          >
            Versione 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

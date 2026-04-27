import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import {
    aggiornaEmail,
    aggiornaNomeUtente,
    caricaFotoProfilo,
    getProfilo,
    giorniRimanenti,
    puoModificare,
} from "../services/profilo";

export default function Profilo() {
  const { Colors } = useTheme();
  const { utente } = useAuth();
  const insets = useSafeAreaInsets();

  const [profilo, setProfilo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [caricandoFoto, setCaricandoFoto] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [successo, setSuccesso] = useState<string | null>(null);

  const [nuovoNome, setNuovoNome] = useState("");
  const [nuovaEmail, setNuovaEmail] = useState("");
  const [modificaNome, setModificaNome] = useState(false);
  const [modificaEmail, setModificaEmail] = useState(false);

  useEffect(() => {
    if (utente) caricaProfilo();
  }, [utente]);

  const caricaProfilo = async () => {
    try {
      const data = await getProfilo(utente!.id);
      setProfilo(data);
      setNuovoNome(data.nome_utente || "");
      setNuovaEmail(utente!.email || "");
    } catch (err) {
      setErrore(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiaFoto = async () => {
    try {
      setCaricandoFoto(true);
      setErrore(null);
      const url = await caricaFotoProfilo(utente!.id);
      setProfilo({ ...profilo, avatar_url: url });
      setSuccesso("Foto aggiornata!");
      setTimeout(() => setSuccesso(null), 3000);
    } catch (err) {
      if (err.message !== "Operazione annullata") {
        setErrore(err.message);
      }
    } finally {
      setCaricandoFoto(false);
    }
  };

  const handleSalvaNome = async () => {
    if (!nuovoNome.trim()) {
      setErrore("Il nome non può essere vuoto");
      return;
    }
    if (!puoModificare(profilo?.ultima_modifica_nome)) {
      setErrore(
        `Puoi modificare il nome tra ${giorniRimanenti(profilo?.ultima_modifica_nome)} giorni`,
      );
      return;
    }
    try {
      setSalvando(true);
      setErrore(null);
      await aggiornaNomeUtente(utente!.id, nuovoNome.trim());
      await caricaProfilo();
      setModificaNome(false);
      setSuccesso("Nome aggiornato!");
      setTimeout(() => setSuccesso(null), 3000);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvaEmail = async () => {
    if (!nuovaEmail.trim()) {
      setErrore("L'email non può essere vuota");
      return;
    }
    if (!puoModificare(profilo?.ultima_modifica_email)) {
      setErrore(
        `Puoi modificare l'email tra ${giorniRimanenti(profilo?.ultima_modifica_email)} giorni`,
      );
      return;
    }
    try {
      setSalvando(true);
      setErrore(null);
      await aggiornaEmail(nuovaEmail.trim());
      await caricaProfilo();
      setModificaEmail(false);
      setSuccesso("Email aggiornata! Controlla la tua casella di posta.");
      setTimeout(() => setSuccesso(null), 5000);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 20,
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

        {/* Foto profilo */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={handleCambiaFoto} disabled={caricandoFoto}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: Colors.white + "30",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor: Colors.white,
                overflow: "hidden",
              }}
            >
              {caricandoFoto ? (
                <ActivityIndicator color={Colors.white} />
              ) : profilo?.avatar_url ? (
                <Image
                  source={{ uri: profilo.avatar_url }}
                  style={{ width: 90, height: 90 }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "800",
                    color: Colors.white,
                  }}
                >
                  {(profilo?.nome_utente || utente?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              )}
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: Colors.white,
                width: 28,
                height: 28,
                borderRadius: 14,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="camera-outline"
                size={16}
                color={Colors.primary}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: Colors.white,
              marginTop: 12,
            }}
          >
            {profilo?.nome_utente || "Utente"}
          </Text>
          <Text
            style={{ fontSize: 13, color: Colors.white + "CC", marginTop: 2 }}
          >
            {utente?.email}
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
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Successo */}
        {successo && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              backgroundColor: Colors.secondary + "15",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={Colors.secondary}
            />
            <Text style={{ color: Colors.secondary, fontSize: 14, flex: 1 }}>
              {successo}
            </Text>
          </View>
        )}

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

        {/* Nome utente */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            letterSpacing: 0.5,
          }}
        >
          NOME UTENTE
        </Text>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 16,
            marginBottom: 8,
          }}
        >
          {modificaNome ? (
            <View>
              <TextInput
                style={{
                  fontSize: 15,
                  color: Colors.textPrimary,
                  marginBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                  paddingBottom: 8,
                }}
                value={nuovoNome}
                onChangeText={setNuovoNome}
                autoFocus
                placeholder="Il tuo nome"
                placeholderTextColor={Colors.textSecondary}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.surfaceAlt,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setModificaNome(false);
                    setNuovoNome(profilo?.nome_utente || "");
                  }}
                >
                  <Text
                    style={{ color: Colors.textSecondary, fontWeight: "600" }}
                  >
                    Annulla
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.primary,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={handleSalvaNome}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Text style={{ color: Colors.white, fontWeight: "600" }}>
                      Salva
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    color: Colors.textPrimary,
                    fontWeight: "500",
                  }}
                >
                  {profilo?.nome_utente || "Non impostato"}
                </Text>
                {!puoModificare(profilo?.ultima_modifica_nome) && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    Modificabile tra{" "}
                    {giorniRimanenti(profilo?.ultima_modifica_nome)} giorni
                  </Text>
                )}
              </View>
              {puoModificare(profilo?.ultima_modifica_nome) && (
                <TouchableOpacity onPress={() => setModificaNome(true)}>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Email */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: Colors.textSecondary,
            marginBottom: 8,
            marginTop: 16,
            letterSpacing: 0.5,
          }}
        >
          EMAIL
        </Text>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.border,
            padding: 16,
            marginBottom: 8,
          }}
        >
          {modificaEmail ? (
            <View>
              <TextInput
                style={{
                  fontSize: 15,
                  color: Colors.textPrimary,
                  marginBottom: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                  paddingBottom: 8,
                }}
                value={nuovaEmail}
                onChangeText={setNuovaEmail}
                autoFocus
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="La tua email"
                placeholderTextColor={Colors.textSecondary}
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.surfaceAlt,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setModificaEmail(false);
                    setNuovaEmail(utente?.email || "");
                  }}
                >
                  <Text
                    style={{ color: Colors.textSecondary, fontWeight: "600" }}
                  >
                    Annulla
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.primary,
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={handleSalvaEmail}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Text style={{ color: Colors.white, fontWeight: "600" }}>
                      Salva
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    color: Colors.textPrimary,
                    fontWeight: "500",
                  }}
                >
                  {utente?.email}
                </Text>
                {!puoModificare(profilo?.ultima_modifica_email) && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    Modificabile tra{" "}
                    {giorniRimanenti(profilo?.ultima_modifica_email)} giorni
                  </Text>
                )}
              </View>
              {puoModificare(profilo?.ultima_modifica_email) && (
                <TouchableOpacity onPress={() => setModificaEmail(true)}>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Info modifica */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
            padding: 12,
            backgroundColor: Colors.primary + "10",
            borderRadius: 12,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.primary}
          />
          <Text style={{ fontSize: 12, color: Colors.textSecondary, flex: 1 }}>
            Nome utente ed email possono essere modificati ogni 90 giorni
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

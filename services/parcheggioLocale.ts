import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { ParcheggioLocale } from "../types";

const CHIAVE = "parcheggio_salvato";
const GRACE_PERIOD_MS = 10 * 60 * 1000;

// Configura come appaiono le notifiche
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Chiede il permesso per le notifiche
export const richiediPermessoNotifiche = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

// Programma le notifiche per la scadenza
const programmaNotifiche = async (scadeAlle: number, indirizzo: string) => {
  // Cancella notifiche precedenti
  await Notifications.cancelAllScheduledNotificationsAsync();

  const ora = Date.now();
  const msAllaScadenza = scadeAlle - ora;

  // Notifica 10 minuti prima della scadenza
  // Notifica 10 minuti prima della scadenza
  if (msAllaScadenza > 10 * 60 * 1000) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Parcheggio in scadenza!",
        body: `Il tuo parcheggio in ${indirizzo} scade tra 10 minuti`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.floor((msAllaScadenza - 10 * 60 * 1000) / 1000),
      },
    });
  }

  // Notifica alla scadenza
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚗 Parcheggio scaduto!",
      body: `Il tuo parcheggio in ${indirizzo} è scaduto`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.floor(msAllaScadenza / 1000),
    },
  });
};

export const salvaParcheggio = async (
  latitude: number,
  longitude: number,
  indirizzo: string,
  note: string,
  durataMinuti: number,
  foto?: string,
): Promise<void> => {
  const ora = Date.now();
  const scadeAlle = ora + durataMinuti * 60 * 1000;

  const parcheggio: ParcheggioLocale = {
    id: ora.toString(),
    latitude,
    longitude,
    indirizzo,
    note,
    foto,
    savedAt: ora,
    scadeAlle,
    eliminaAlle: scadeAlle + GRACE_PERIOD_MS,
  };

  await AsyncStorage.setItem(CHIAVE, JSON.stringify(parcheggio));

  // Programma le notifiche
  const permesso = await richiediPermessoNotifiche();
  if (permesso) {
    await programmaNotifiche(scadeAlle, indirizzo);
  }
};

export const getParcheggioSalvato =
  async (): Promise<ParcheggioLocale | null> => {
    const data = await AsyncStorage.getItem(CHIAVE);
    if (!data) return null;

    const parcheggio: ParcheggioLocale = JSON.parse(data);

    if (Date.now() > parcheggio.eliminaAlle) {
      await eliminaParcheggioSalvato();
      return null;
    }

    return parcheggio;
  };

export const eliminaParcheggioSalvato = async (): Promise<void> => {
  // Cancella anche le notifiche programmate
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(CHIAVE);
};

export const tempoRimanente = (scadeAlle: number) => {
  const msRimanenti = Math.max(0, scadeAlle - Date.now());
  const ore = Math.floor(msRimanenti / 1000 / 60 / 60);
  const minuti = Math.floor((msRimanenti / 1000 / 60) % 60);
  const secondi = Math.floor((msRimanenti / 1000) % 60);
  return { ore, minuti, secondi, totaleMs: msRimanenti };
};

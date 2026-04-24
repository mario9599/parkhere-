import * as Location from "expo-location";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

// Chiede il permesso e recupera la posizione attuale
export const getPosizione = async (): Promise<Coordinate> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error(
      "Permesso posizione negato — abilita la posizione nelle impostazioni",
    );
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

// Converte coordinate in indirizzo leggibile
export const getIndirizzo = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const risultati = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (risultati.length === 0)
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    const r = risultati[0];
    const parti = [r.street, r.streetNumber, r.city].filter(Boolean);
    return (
      parti.join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    );
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

// Prende posizione e indirizzo insieme
export const getPosizioneConIndirizzo = async (): Promise<{
  latitude: number;
  longitude: number;
  indirizzo: string;
}> => {
  const { latitude, longitude } = await getPosizione();
  const indirizzo = await getIndirizzo(latitude, longitude);
  return { latitude, longitude, indirizzo };
};

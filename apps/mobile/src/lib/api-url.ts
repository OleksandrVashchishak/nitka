import Constants from "expo-constants";
import { Platform } from "react-native";

/** Resolve Nest API base URL for emulator / simulator / device. */
export function getApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:3001`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  }

  return "http://localhost:3001";
}

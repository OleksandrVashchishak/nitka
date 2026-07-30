import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

/** SecureStore on native; localStorage fallback for web. */
export const secureStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(name);
    }
    return SecureStore.getItemAsync(name);
  },
  setItem: async (name, value) => {
    if (Platform.OS === "web") {
      localStorage.setItem(name, value);
      return;
    }
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(name);
      return;
    }
    await SecureStore.deleteItemAsync(name);
  },
};

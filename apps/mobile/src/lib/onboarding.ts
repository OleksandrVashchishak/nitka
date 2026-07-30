import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "nitka-onboarding-v1";

type Store = Record<string, { completedAt: string }>;

async function read(): Promise<Store> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

export async function isOnboardingCompleted(weddingId: string) {
  const store = await read();
  return Boolean(store[weddingId]?.completedAt);
}

export async function markOnboardingCompleted(weddingId: string) {
  const store = await read();
  store[weddingId] = { completedAt: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify(store));
}

export async function clearOnboardingCompleted(weddingId: string) {
  const store = await read();
  delete store[weddingId];
  await AsyncStorage.setItem(KEY, JSON.stringify(store));
}

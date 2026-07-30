import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "nitka:pending-partner-invite";

export async function savePendingPartnerInvite(token: string) {
  await AsyncStorage.setItem(KEY, token);
}

export async function peekPendingPartnerInvite() {
  return AsyncStorage.getItem(KEY);
}

export async function clearPendingPartnerInvite() {
  await AsyncStorage.removeItem(KEY);
}

/** @deprecated use clear after accept; prefer peek for redirect */
export async function consumePendingPartnerInvite() {
  const token = await AsyncStorage.getItem(KEY);
  if (token) await AsyncStorage.removeItem(KEY);
  return token;
}

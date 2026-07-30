import { Alert, Platform } from "react-native";
import { showToast } from "@/lib/toast-store";

/** Confirm that works on web (window.confirm) and native (Alert). */
export function confirmAction(
  title: string,
  message: string,
  onYes: () => void,
) {
  if (Platform.OS === "web") {
    // eslint-disable-next-line no-alert
    if (
      typeof window !== "undefined" &&
      window.confirm(`${title}\n\n${message}`)
    ) {
      onYes();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: "Ні", style: "cancel" },
    { text: "Так", style: "destructive", onPress: onYes },
  ]);
}

/** Non-blocking snackbar (не Alert). */
export function notify(
  title: string,
  message?: string,
  tone: "default" | "ok" | "warn" = "default",
) {
  showToast({ title, message, tone });
}

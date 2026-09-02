import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";
import { apiFetch } from "@/lib/client-api";
import { href } from "@/lib/href";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let cachedToken: string | null = null;

export async function registerForPushAsync(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
            name: "fata.studio",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  const token = (
    await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    )
  ).data;

  cachedToken = token;

  await apiFetch("/api/notifications/push-token", {
    method: "POST",
    body: JSON.stringify({ token, platform: Platform.OS }),
    silent: true,
  });

  return token;
}

export async function unregisterPushAsync() {
  if (!cachedToken) return;
  try {
    await apiFetch("/api/notifications/push-token", {
      method: "DELETE",
      body: JSON.stringify({ token: cachedToken }),
      silent: true,
    });
  } catch {
    /* ignore */
  }
  cachedToken = null;
}

function routeForPushData(data?: Record<string, unknown> | null) {
  const type = typeof data?.type === "string" ? data.type : "";
  if (type === "invite_reply" || type === "rsvp") {
    return href("/(app)/(couple)/guests");
  }
  if (type === "task_due") {
    return href("/(app)/(couple)/checklist");
  }
  if (type === "wedding_update") {
    return href("/(app)/(couple)/wedding");
  }
  if (type.includes("request")) {
    return href("/(app)/(couple)/more");
  }
  return href("/(app)/(couple)");
}

/** Підписка на тап по пушу → deep link. Повертає cleanup. */
export function attachPushResponseListener() {
  const sub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data as
        | Record<string, unknown>
        | undefined;
      try {
        router.push(routeForPushData(data));
      } catch {
        /* ignore */
      }
    },
  );
  return () => sub.remove();
}

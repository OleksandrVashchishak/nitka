import { apiFetch } from "@/lib/client-api";
import { useAuthStore } from "@/lib/auth-store";
import { getApiUrl } from "@/lib/api-url";
import { Platform } from "react-native";

export async function uploadImage(uri: string, fileName = "photo.jpg") {
  const token = useAuthStore.getState().accessToken;

  // Web: turn blob:/data: URI into a real File for multipart
  if (Platform.OS === "web") {
    const resBlob = await fetch(uri);
    const blob = await resBlob.blob();
    const file = new File([blob], fileName, {
      type: blob.type || "image/jpeg",
    });
    return uploadImageWeb(file, fileName);
  }

  const form = new FormData();
  form.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await fetch(`${getApiUrl()}/api/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  if (!res.ok) {
    const raw = await res.text();
    throw new Error(raw || "Не вдалося завантажити фото");
  }

  return res.json() as Promise<{ url: string; provider: string }>;
}

/** Prefer apiFetch when FormData works (web). */
export function uploadImageWeb(file: Blob, fileName = "photo.jpg") {
  const body = new FormData();
  body.append("file", file, fileName);
  return apiFetch<{ url: string; provider: string }>("/api/uploads", {
    method: "POST",
    body,
  });
}

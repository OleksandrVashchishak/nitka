import { refreshRequest } from "@/lib/auth-api";
import { getApiUrl } from "@/lib/api-url";
import { useAuthStore } from "@/lib/auth-store";

type ApiErrorBody = {
  message?: string | string[];
};

export type ApiFetchOptions = RequestInit & {
  silent?: boolean;
  _retried?: boolean;
};

async function parseError(res: Response, raw: string) {
  if (!raw) return "Щось пішло не так";
  try {
    const body = JSON.parse(raw) as ApiErrorBody;
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return "Щось пішло не так";
}

async function tryRefreshAccessToken() {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return null;
  try {
    const data = await refreshRequest(refreshToken);
    useAuthStore.setState({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.accessToken;
  } catch {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { silent, _retried, ...init } = options;
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(init.headers);
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  if (!headers.has("Content-Type") && init.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers,
    });
  } catch {
    const message = "Немає звʼязку з сервером";
    throw new Error(message);
  }

  if (res.status === 401 && !_retried) {
    const nextToken = await tryRefreshAccessToken();
    if (nextToken) {
      return apiFetch<T>(path, { ...options, _retried: true });
    }
  }

  const raw = await res.text();

  if (!res.ok) {
    const message = await parseError(res, raw);
    if (res.status === 401) {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      if (silent) return null as T;
    }
    throw new Error(message);
  }

  if (res.status === 204 || !raw.trim()) {
    return null as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("Некоректна відповідь сервера");
  }
}

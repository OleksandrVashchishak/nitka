import { useAuthStore } from "@/lib/auth-store";
import { refreshRequest } from "@/lib/auth-api";
import { toast } from "@/lib/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiErrorBody = {
  message?: string | string[];
};

export type ApiFetchOptions = RequestInit & {
  /** Не показувати toast при помилці */
  silent?: boolean;
  /** Toast після успішної відповіді */
  successToast?: string;
  /** Внутрішній прапорець — не ретраїти 401 повторно */
  _retried?: boolean;
};

async function readBody(res: Response): Promise<string> {
  return res.text();
}

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
  const { silent, successToast, _retried, ...init } = options;
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

  const method = (init.method ?? "GET").toUpperCase();
  const isMutation = !["GET", "HEAD"].includes(method);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    const message = "Немає звʼязку з сервером";
    if (!silent && isMutation) toast.error(message);
    throw new Error(message);
  }

  if (res.status === 401 && !_retried) {
    const nextToken = await tryRefreshAccessToken();
    if (nextToken) {
      return apiFetch<T>(path, { ...options, _retried: true });
    }
  }

  const raw = await readBody(res);

  if (!res.ok) {
    const message = await parseError(res, raw);
    if (res.status === 401) {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      // Background probes (favorites, notifications) — не валимо сторінку
      if (silent) {
        return null as T;
      }
    }
    if (!silent && isMutation) toast.error(message);
    throw new Error(message);
  }

  if (successToast) {
    toast.success(successToast);
  }

  if (res.status === 204 || !raw.trim()) {
    return null as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    const message = "Некоректна відповідь сервера";
    if (!silent) toast.error(message);
    throw new Error(message);
  }
}

export function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ url: string; provider: "cloudinary" | "local" }>(
    "/api/uploads",
    { method: "POST", body },
  );
}

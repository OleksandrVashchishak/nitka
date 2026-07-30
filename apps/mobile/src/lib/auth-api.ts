import { getApiUrl } from "@/lib/api-url";

export type Role = "COUPLE" | "VENDOR" | "ADMIN" | "GUEST";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type AuthErrorBody = {
  message?: string | string[];
};

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as AuthErrorBody;
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return "Щось пішло не так";
}

function api(path: string) {
  return `${getApiUrl()}${path}`;
}

export async function loginRequest(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(api("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function registerRequest(input: {
  email: string;
  password: string;
  name: string;
  role: "COUPLE" | "VENDOR";
}): Promise<AuthResponse> {
  const res = await fetch(api("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function meRequest(accessToken: string): Promise<AuthUser> {
  const res = await fetch(api("/api/auth/me"), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function logoutRequest(accessToken: string) {
  await fetch(api("/api/auth/logout"), {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function checkEmailAvailable(
  email: string,
): Promise<{ available: boolean }> {
  const params = new URLSearchParams({ email });
  const res = await fetch(api(`/api/auth/check-email?${params}`));
  if (!res.ok) return { available: true };
  return res.json();
}

export async function refreshRequest(
  refreshToken: string,
): Promise<AuthResponse> {
  const res = await fetch(api("/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

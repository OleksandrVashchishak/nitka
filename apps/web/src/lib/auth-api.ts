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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type AuthErrorBody = {
  message?: string | string[];
  statusCode?: number;
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

export async function registerRequest(input: {
  email: string;
  password: string;
  name: string;
  role: "COUPLE" | "VENDOR";
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function loginRequest(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function meRequest(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function logoutRequest(accessToken: string) {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function refreshRequest(
  refreshToken: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

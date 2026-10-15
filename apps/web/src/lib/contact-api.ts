const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ErrorBody = {
  message?: string | string[];
};

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as ErrorBody;
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return "Щось пішло не так";
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<{ id: string }>;
}

"use client";

import { FormEvent, useState } from "react";
import type { RequestMessage } from "@/lib/dashboard-api";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type Props = {
  initialMessage: string;
  initialAt: string;
  initialAuthor: string;
  messages: RequestMessage[];
  viewer: "COUPLE" | "VENDOR";
  onSend: (input: { body: string; phone?: string }) => Promise<void>;
  disabled?: boolean;
};

export function RequestThread({
  initialMessage,
  initialAt,
  initialAuthor,
  messages,
  viewer,
  onSend,
  disabled,
}: Props) {
  const [body, setBody] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending || disabled) return;
    setSending(true);
    setError(null);
    try {
      await onSend({
        body: body.trim(),
        phone: viewer === "VENDOR" && phone.trim() ? phone.trim() : undefined,
      });
      setBody("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не надіслано");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="space-y-3">
        <article className="rounded-2xl bg-mist px-4 py-3">
          <p className="text-xs font-medium text-ink-soft">
            {initialAuthor} · {formatDate(initialAt)}
          </p>
          <p className="mt-1 text-ink">{initialMessage}</p>
        </article>

        {messages.map((msg) => {
          const fromVendor = msg.authorRole === "VENDOR";
          const mine =
            (viewer === "VENDOR" && fromVendor) ||
            (viewer === "COUPLE" && !fromVendor);

          return (
            <article
              key={msg.id}
              className={
                mine
                  ? "ml-4 rounded-2xl bg-sage/15 px-4 py-3 md:ml-10"
                  : "mr-4 rounded-2xl border border-line bg-white px-4 py-3 md:mr-10"
              }
            >
              <p className="text-xs font-medium text-ink-soft">
                {fromVendor ? "Підрядник" : "Пара"} · {msg.author.name} ·{" "}
                {formatDate(msg.createdAt)}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{msg.body}</p>
              {msg.phone ? (
                <p className="mt-2 text-sm font-medium text-sage-deep">
                  Контакт:{" "}
                  <a href={`tel:${msg.phone}`} className="underline-offset-2 hover:underline">
                    {msg.phone}
                  </a>
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      {!disabled ? (
        <form onSubmit={submit} className="space-y-3 border-t border-line pt-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder={
              viewer === "VENDOR"
                ? "Наприклад: можемо на цю дату, ось деталі..."
                : "Відповісти підряднику..."
            }
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          {viewer === "VENDOR" ? (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон (необовʼязково)"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          ) : null}
          {error ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-50"
          >
            {sending ? "Надсилаємо..." : "Надіслати"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

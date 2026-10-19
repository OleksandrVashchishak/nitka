"use client";

import { FormEvent, useState } from "react";
import { submitContactMessage } from "@/lib/contact-api";
import "@/styles/landing/contact.scss";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setName("");
      setEmail("");
      setMessage("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося надіслати");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fata-contact">
      <div className="fata-contact-main">
        <div className="fata-contact-copy">
          <p className="fata-contact-eyebrow">
            FATA.STUDIO • НАПИШІТЬ НАМ
          </p>
          <h1 className="fata-contact-title">
            Маєте питання або пропозиції? Напишіть нам
          </h1>
          <p className="fata-contact-lead">
            Фідбек, партнерські пропозиції, побажання, ідеї — все сюди.
          </p>
        </div>

        <form className="fata-contact-form" onSubmit={onSubmit} noValidate>
          <div className="fata-contact-row">
            <label className="fata-contact-field">
              <input
                type="text"
                name="name"
                aria-label="Ім'я"
                autoComplete="name"
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                disabled={busy}
              />
            </label>
            <label className="fata-contact-field">
              <input
                type="email"
                name="email"
                aria-label="Емайл"
                autoComplete="email"
                placeholder="Емайл"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                disabled={busy}
              />
            </label>
          </div>

          <label className="fata-contact-field fata-contact-field--message">
            <textarea
              name="message"
              aria-label="Повідомлення"
              placeholder="Ваше запитання, пропозиція, побажання ітд"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={5000}
              rows={2}
              disabled={busy}
            />
          </label>

          <button
            type="submit"
            className="fata-contact-submit"
            disabled={busy}
          >
            {busy ? "Надсилаємо…" : "Надіслати"}
          </button>

          {done ? (
            <p className="fata-contact-status is-ok" role="status">
              Дякуємо! Ми отримали ваше повідомлення.
            </p>
          ) : null}
          {error ? (
            <p className="fata-contact-status is-err" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

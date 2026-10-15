"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitContactMessage } from "@/lib/contact-api";
import "@/styles/landing/hero.scss";
import "@/styles/landing/rest.scss";
import "@/styles/landing/contact.scss";

const FOOT_PRODUCT = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Запрошення" },
  { href: "/vesilnyy-sayt", label: "Сайт-запрошення" },
] as const;

function FataLogo({
  src = "/landing/logo-foot.svg",
}: {
  src?: string;
}) {
  return (
    <Link href="/" className="fata-logo" aria-label="fata.studio">
      <img src={src} alt="fata.studio" width={154} height={32} />
    </Link>
  );
}

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

      <footer className="fata-foot">
        <div className="fata-shell fata-foot-inner">
          <div className="fata-foot-top">
            <div className="fata-foot-brand">
              <FataLogo />
              <p>Сучасний інструмент для планування весілля</p>
            </div>
            <div>
              <h4>Продукт</h4>
              {FOOT_PRODUCT.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <h4>Компанія</h4>
              <a href="https://instagram.com" rel="noreferrer" target="_blank">
                Instagram
              </a>
              <a href="https://facebook.com" rel="noreferrer" target="_blank">
                Facebook
              </a>
              <Link href="/blog">Ідеї</Link>
            </div>
            <div>
              <h4>Підтримка</h4>
              <Link href="/content">Умови використання</Link>
              <Link href="/content">Політика конфіденційності</Link>
              <Link href="/napyshit-nam">Напишіть нам</Link>
            </div>
          </div>
          <div className="fata-foot-line" />
          <div className="fata-foot-bottom">
            <span>© 2026 fata.studio. Усі права захищені.</span>
            <span className="fata-foot-social">
              <a href="https://instagram.com" aria-label="Instagram">
                <img
                  src="/landing/cloud/ig.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <img
                  src="/landing/cloud/fb.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

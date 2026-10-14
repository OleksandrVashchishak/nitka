"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";

export function AdminLoginForm() {
  const router = useRouter();
  const hydrated = useAdminAuthStore((s) => s.hydrated);
  const accessToken = useAdminAuthStore((s) => s.accessToken);
  const login = useAdminAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/admin");
    }
  }, [hydrated, accessToken, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка входу");
    } finally {
      setPending(false);
    }
  }

  if (!hydrated || accessToken) {
    return <div className="admin-loader">Завантаження…</div>;
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Суперадмін</h1>
        <p>Внутрішня панель fata.studio</p>
        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Логін</label>
            <input
              id="admin-email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Пароль</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="admin-btn" type="submit" disabled={pending}>
            {pending ? "Вхід…" : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}

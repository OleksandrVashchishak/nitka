"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { getErrorMessage, toast } from "@/lib/toast";
import { LoadingButtonLabel } from "@/components/ui-loader";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const role = useAuthStore.getState().user?.role;
      router.push(getHomePath(role));
    } catch (err) {
      toast.error(getErrorMessage(err, "Не вдалось увійти"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-ink-soft">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-sage"
          placeholder="you@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-ink-soft">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-sage"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sage px-4 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:opacity-60"
      >
        <LoadingButtonLabel loading={loading} loadingText="Входимо…">
          Увійти
        </LoadingButtonLabel>
      </button>

      <p className="text-center text-sm text-ink-soft">
        Ще немає акаунта?{" "}
        <Link
          href="/register"
          className="font-medium text-sage-deep underline-offset-4 hover:underline"
        >
          Зареєструватись
        </Link>
      </p>
    </form>
  );
}

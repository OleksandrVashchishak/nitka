"use client";

import { useMemo, useState } from "react";
import {
  createPartnerInvite,
  type Wedding,
  type WeddingMember,
} from "@/lib/dashboard-api";
import { toast } from "@/lib/toast";

type Props = {
  wedding: Wedding;
};

export function PartnerAccessCard({ wedding }: Props) {
  const [busy, setBusy] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const members = wedding.members ?? [];
  const myRole = wedding.myRole ?? "OWNER";
  const partner = members.find((m) => m.role === "PARTNER");
  const isOwner = myRole === "OWNER";

  const memberLabel = useMemo(() => {
    return members
      .map((m: WeddingMember) => `${m.user.name} (${m.role === "OWNER" ? "власник" : "партнер"})`)
      .join(" · ");
  }, [members]);

  async function onCreateInvite() {
    setBusy(true);
    setError(null);
    try {
      const invite = await createPartnerInvite();
      const url = `${window.location.origin}${invite.path}`;
      setInviteUrl(url);
      toast.success("Лінк готовий", "Надішли партнеру — діятиме 14 днів");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не створено лінк");
    } finally {
      setBusy(false);
    }
  }

  async function copyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Скопійовано", "Лінк у буфері");
    } catch {
      setError("Не вдалось скопіювати");
    }
  }

  return (
    <section className="mb-6 rounded-3xl border border-line bg-white p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-deep">
        Спільний доступ
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
        Другий партнер
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Один акаунт створює весілля, другий заходить по лінку — і бачить той самий
        план, бюджет і гостей.
      </p>

      {members.length > 0 ? (
        <p className="mt-3 text-sm text-ink">{memberLabel}</p>
      ) : null}

      {partner ? (
        <p className="mt-3 rounded-xl bg-mist px-4 py-3 text-sm text-ink">
          Партнер уже в кабінеті: <strong>{partner.user.name}</strong> (
          {partner.user.email})
        </p>
      ) : isOwner ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void onCreateInvite()}
            className="rounded-full bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
          >
            {busy ? "Створюємо…" : inviteUrl ? "Оновити лінк" : "Запросити партнера"}
          </button>
          {inviteUrl ? (
            <button
              type="button"
              onClick={() => void copyInvite()}
              className="rounded-full border border-sage px-4 py-2.5 text-sm font-semibold text-sage-deep hover:bg-mist"
            >
              Копіювати лінк
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          Ти в кабінеті як партнер. Запрошувати може лише власник весілля.
        </p>
      )}

      {inviteUrl ? (
        <p className="mt-3 break-all rounded-xl bg-mist px-3 py-2 text-xs text-ink-soft">
          {inviteUrl}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}

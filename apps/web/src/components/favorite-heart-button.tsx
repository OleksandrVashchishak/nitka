"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/lib/dashboard-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import { ButtonSpinner } from "@/components/ui-loader";

let loadedForUser: string | null = null;
let favoriteIds = new Set<string>();
let loadingFavorites: Promise<Set<string>> | null = null;

async function loadFavoriteIds(userId: string) {
  if (loadedForUser === userId) return favoriteIds;
  if (!loadingFavorites) {
    loadingFavorites = getFavorites()
      .then((items) => {
        favoriteIds = new Set(items.map((item) => item.vendor.id));
        loadedForUser = userId;
        return favoriteIds;
      })
      .catch(() => {
        favoriteIds = new Set();
        loadedForUser = null;
        return favoriteIds;
      })
      .finally(() => {
        loadingFavorites = null;
      });
  }
  return loadingFavorites;
}

type Props = {
  vendorId: string;
};

export function FavoriteHeartButton({ vendorId }: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [active, setActive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hydrated || !user || !["COUPLE", "ADMIN"].includes(user.role)) {
      setActive(false);
      return;
    }

    let alive = true;
    void loadFavoriteIds(user.id).then((ids) => {
      if (alive) setActive(ids.has(vendorId));
    });

    function sync(event: Event) {
      const detail = (event as CustomEvent<{ vendorId: string; active: boolean }>)
        .detail;
      if (detail?.vendorId === vendorId) setActive(detail.active);
    }
    window.addEventListener("nitka:favorite-change", sync);
    return () => {
      alive = false;
      window.removeEventListener("nitka:favorite-change", sync);
    };
  }, [hydrated, user, vendorId]);

  async function toggle() {
    if (!hydrated) return;
    if (!user) {
      toast.info("Увійди, щоб зберігати обране");
      router.push("/login");
      return;
    }
    if (!["COUPLE", "ADMIN"].includes(user.role)) {
      toast.error("Обране доступне для наречених");
      return;
    }

    setSaving(true);
    try {
      if (active) {
        await removeFavorite(vendorId);
        favoriteIds.delete(vendorId);
      } else {
        await addFavorite(vendorId);
        favoriteIds.add(vendorId);
      }
      const next = !active;
      setActive(next);
      window.dispatchEvent(
        new CustomEvent("nitka:favorite-change", {
          detail: { vendorId, active: next },
        }),
      );
    } catch {
      /* apiFetch already toasts mutation errors */
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={saving}
      aria-label={active ? "Прибрати з обраного" : "Додати в обране"}
      aria-pressed={active}
      className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm transition hover:scale-105 disabled:opacity-60"
    >
      {saving ? (
        <ButtonSpinner className="size-4 border-sage/30 border-t-sage" />
      ) : (
        <span className={active ? "text-rose-500" : "text-ink"} aria-hidden>
          {active ? "♥" : "♡"}
        </span>
      )}
    </button>
  );
}

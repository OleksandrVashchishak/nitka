"use client";

import { useEffect, useRef, useState } from "react";
import { IconClose } from "@/components/icon-close";
import { useToastStore, type ToastTone } from "@/lib/toast";

const TONE_STYLES: Record<
  ToastTone,
  { bar: string; icon: string; label: string }
> = {
  success: {
    bar: "bg-sage",
    icon: "✓",
    label: "Успіх",
  },
  error: {
    bar: "bg-red-500",
    icon: "!",
    label: "Помилка",
  },
  info: {
    bar: "bg-ink",
    icon: "i",
    label: "Інфо",
  },
};

export function ToastViewport() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex flex-col items-end gap-3 p-4 sm:p-6"
      aria-live="polite"
      aria-relevant="additions"
      data-toast-viewport
    >
      {items.map((item) => (
        <ToastCard
          key={item.id}
          id={item.id}
          tone={item.tone}
          title={item.title}
          description={item.description}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({
  id,
  tone,
  title,
  description,
  onDismiss,
}: {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  onDismiss: () => void;
}) {
  const style = TONE_STYLES[tone];

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 4200);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  const endDrag = (dismiss: boolean) => {
    startY.current = null;
    if (dismiss) onDismiss();
    else setDragY(0);
  };

  return (
    <div
      className="pointer-events-auto animate-toast-in w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_50px_rgba(22,26,23,0.16)]"
      style={{
        touchAction: "none",
        transform: dragY ? `translateY(${dragY}px)` : undefined,
        opacity: dragY ? Math.max(0.3, 1 + dragY / 120) : undefined,
        transition: startY.current === null ? "transform 0.2s, opacity 0.2s" : undefined,
      }}
      onPointerDown={(e) => {
        startY.current = e.clientY;
      }}
      onPointerMove={(e) => {
        if (startY.current === null) return;
        setDragY(Math.min(0, e.clientY - startY.current));
      }}
      onPointerUp={() => endDrag(dragY < -40)}
      onPointerCancel={() => endDrag(false)}
    >
      <div className={`h-1 w-full ${style.bar}`} />
      <div className="flex items-start gap-3 px-4 py-3.5">
        <span
          className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${style.bar}`}
        >
          {style.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            {style.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-5 text-ink-soft">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-2 py-1 text-sm text-ink-soft transition hover:bg-mist hover:text-ink"
          aria-label="Закрити"
        >
          <IconClose size={16} />
        </button>
      </div>
    </div>
  );
}

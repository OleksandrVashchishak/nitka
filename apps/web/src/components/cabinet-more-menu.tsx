"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CabinetNavIcon } from "@/components/cabinet-nav-icons";

const MORE_LINKS = [
  { href: "/my-vendors", label: "Підрядники", icon: "vendors" },
  { href: "/guests", label: "Гості", icon: "guests" },
  { href: "/seating", label: "Розсадка", icon: "seating" },
  { href: "/blog", label: "Дошка натхнення", icon: "board" },
  { href: "/settings", label: "Налаштування", icon: "settings" },
] as const;

const ANIM_MS = 320;

export function CabinetMoreMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setVisible(true));
      });
      return () => window.cancelAnimationFrame(id);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), ANIM_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      id="cabinet-more-menu"
      className={`cabinet-more-menu${visible ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ще"
    >
      <button
        type="button"
        className="cabinet-more-menu-backdrop"
        aria-label="Закрити меню"
        onClick={onClose}
      />
      <div className="cabinet-more-menu-panel">
        <h2 className="cabinet-more-title">Ще</h2>
        <nav className="cabinet-more-list" aria-label="Додаткові розділи">
          {MORE_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cabinet-more-item"
              onClick={onClose}
            >
              <span className="cabinet-more-icon" aria-hidden>
                <CabinetNavIcon name={item.icon} size={22} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

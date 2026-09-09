"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "@/app/login.css";

export function AuthSplitShell({ children }: { children: ReactNode }) {
  return (
    <div className="login-page">
      <section className="login-left">
        <div className="login-col">{children}</div>
      </section>

      <aside className="login-right" aria-hidden="true">
        <h2 className="login-hero">
          <span className="login-hero-row">
            <span className="login-hero-line is-italic">Єдина</span>{" "}
            <span className="login-hero-line is-accent">ПЛАТФОРМА</span>
          </span>
          <span className="login-hero-line is-regular">
            для всіх весільних завдань
          </span>
        </h2>
        <p className="login-lead">
          Сучасні інструменти для планування без стресу. Чеклісти, бюджети,
          гості та розсадка — усе в одному місці.
        </p>
        <div className="login-photo">
          <Image
            src="/landing/feat-1.jpg"
            alt="Пара на заході сонця"
            fill
            priority
            sizes="50vw"
          />
          <div className="login-tag">
            <CursorIcon />
            Olya Vashchyshak
          </div>
          <div className="login-copy">FATA.STUDIO © 2026</div>
        </div>
      </aside>
    </div>
  );
}

export function AuthLogo() {
  return (
    <Link href="/" className="login-logo" aria-label="fata.studio">
      fata.studi<span className="fata-ring">o</span>
    </Link>
  );
}

function CursorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M2 1.5 8.5 16l1.7-5.2L16 9.2 2 1.5Z"
        fill="#1A1A1A"
        stroke="#fff"
        strokeWidth="1"
      />
    </svg>
  );
}

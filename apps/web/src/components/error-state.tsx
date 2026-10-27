import type { ReactNode } from "react";
import "@/styles/landing/error-page.scss";

type ErrorStateProps = {
  code: string;
  title: string;
  text: string;
  children?: ReactNode;
};

export function ErrorState({ code, title, text, children }: ErrorStateProps) {
  return (
    <section className="fata-error">
      <div className="fata-error__inner">
        <p className="fata-error__code" aria-hidden>
          {code}
        </p>
        <h1 className="fata-error__title">{title}</h1>
        <p className="fata-error__text">{text}</p>
        {children ? <div className="fata-error__actions">{children}</div> : null}
      </div>
    </section>
  );
}

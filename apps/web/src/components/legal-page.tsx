import Link from "next/link";
import {
  LEGAL_UPDATED,
  type LegalDoc,
} from "@/lib/legal-content";
import "@/styles/landing/legal.scss";

const DOC_LINKS = [
  { href: "/privacy", label: "Політика конфіденційності" },
  { href: "/terms", label: "Умови використання" },
  { href: "/cookies", label: "Політика cookie" },
] as const;

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="fata-legal">
      <div className="fata-legal__inner">
        <header className="fata-legal__head">
          <p className="fata-legal__eyebrow">{doc.eyebrow}</p>
          <h1 className="fata-legal__title">{doc.title}</h1>
          <p className="fata-legal__lead">{doc.lead}</p>
          <p className="fata-legal__updated">
            Останнє оновлення: {LEGAL_UPDATED}
          </p>
        </header>

        <div className="fata-legal__body">
          {doc.sections.map((section) => (
            <section className="fata-legal__section" key={section.title}>
              <h2 className="fata-legal__heading">{section.title}</h2>
              {section.text?.map((paragraph) => (
                <p className="fata-legal__text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="fata-legal__list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.after ? (
                <p className="fata-legal__text">{section.after}</p>
              ) : null}
            </section>
          ))}
        </div>

        <nav className="fata-legal__nav" aria-label="Інші документи">
          {DOC_LINKS.filter((link) => link.href !== `/${doc.slug}`).map(
            (link) => (
              <Link
                href={link.href}
                className="fata-legal__nav-link"
                key={link.href}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </article>
  );
}

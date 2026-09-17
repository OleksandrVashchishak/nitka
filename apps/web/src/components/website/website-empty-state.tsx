"use client";

import Image from "next/image";

type Props = {
  creating: boolean;
  onCreate: () => void;
};

export function WebsiteEmptyState({ creating, onCreate }: Props) {
  return (
    <section className="ws-empty" aria-labelledby="ws-empty-title">
      <div className="ws-empty__art" aria-hidden>
        <Image
          src="/cabinet/empty/website.png"
          alt=""
          width={720}
          height={520}
          className="ws-empty__art-img"
          priority
        />
      </div>

      <h2 id="ws-empty-title" className="ws-empty__title">
        Створимо ваш сайт-запрошення?
      </h2>
      <p className="ws-empty__text">
        Створи тут запрошення — живий сайт для твого свята — і надішли його
        гостям прямо звідси.
      </p>
      <div className="ws-empty__cta">
        <button
          type="button"
          className="ws-btn ws-btn--empty"
          disabled={creating}
          onClick={onCreate}
        >
          {creating ? "Створюємо…" : "Створити сайт"}
        </button>
      </div>
    </section>
  );
}

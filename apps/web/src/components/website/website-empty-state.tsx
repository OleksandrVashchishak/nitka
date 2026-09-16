"use client";

import Image from "next/image";

type Props = {
  creating: boolean;
  onCreate: () => void;
};

export function WebsiteEmptyState({ creating, onCreate }: Props) {
  return (
    <section className="ws-empty" aria-labelledby="ws-empty-title">
      <div className="ws-empty__phones" aria-hidden>
        <div className="ws-empty__phone ws-empty__phone--left">
          <div className="ws-empty__phone-screen">
            <Image
              src="/landing/couple.jpg"
              alt=""
              width={148}
              height={140}
              className="ws-empty__phone-img"
            />
            <div className="ws-empty__phone-copy">
              <p className="ws-empty__phone-kicker">Запрошення</p>
              <p className="ws-empty__phone-names">Дарія & Максим</p>
            </div>
          </div>
        </div>
        <div className="ws-empty__phone ws-empty__phone--right">
          <div className="ws-empty__phone-screen">
            <div className="ws-empty__phone-copy">
              <p className="ws-empty__phone-kicker">Коли і де</p>
              <p className="ws-empty__phone-names">25 липня 2027</p>
              <p className="ws-empty__phone-meta">
                Живий сайт для гостей — дата, локація і RSVP в одному місці.
              </p>
            </div>
          </div>
        </div>
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
          className="ws-btn ws-btn--solid"
          disabled={creating}
          onClick={onCreate}
        >
          {creating ? "Створюємо…" : "Створити сайт"}
        </button>
      </div>
    </section>
  );
}

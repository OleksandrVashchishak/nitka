/* eslint-disable @next/next/no-img-element */

import type { WebsiteScheduleItem } from "@/lib/website-api";

type Props = {
  title: string;
  items: WebsiteScheduleItem[];
  imageUrl?: string;
};

export function WsiteSchedule({ title, items, imageUrl }: Props) {
  if (!items.length && !imageUrl) return null;

  return (
    <section className="wsite-schedule">
      <div className="wsite-schedule__inner">
        <div className="wsite-schedule__intro">
          {imageUrl ? (
            <div className="wsite-schedule__photo">
              <img src={imageUrl} alt="" className="wsite-schedule__img" />
            </div>
          ) : null}

          <div className="wsite-schedule__titles">
            {title ? (
              <h2 className="wsite-schedule__title">{title}</h2>
            ) : null}
            {items.length ? (
              <p className="wsite-schedule__eyebrow">Розклад урочистостей</p>
            ) : null}
          </div>
        </div>

        {items.length ? (
          <div className="wsite-schedule__list">
            {items.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={`wsite-schedule__item${
                  index % 2 === 1 ? " wsite-schedule__item--end" : ""
                }`}
              >
                {item.time ? (
                  <p className="wsite-schedule__time">{item.time}</p>
                ) : null}
                <div className="wsite-schedule__rule" aria-hidden />
                <h3 className="wsite-schedule__name">
                  {item.title || `Подія ${index + 1}`}
                </h3>
                {item.detail ? (
                  <p className="wsite-schedule__detail">{item.detail}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

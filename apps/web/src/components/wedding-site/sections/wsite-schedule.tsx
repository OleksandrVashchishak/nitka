import type { WebsiteScheduleItem } from "@/lib/website-api";

type Props = {
  title: string;
  items: WebsiteScheduleItem[];
};

export function WsiteSchedule({ title, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="wsite-section wsite-schedule">
      <div className="wsite-section__inner">
        <h2 className="wsite-section__title wsite-schedule__title">{title}</h2>
        <div className="wsite-schedule__grid">
          {items.slice(0, 3).map((item, index) => (
            <article key={`${item.title}-${index}`} className="wsite-schedule__item">
              <span className="wsite-schedule__mark" aria-hidden />
              <h3 className="wsite-schedule__name">{item.title || `Подія ${index + 1}`}</h3>
              {item.detail ? (
                <p className="wsite-schedule__detail">{item.detail}</p>
              ) : null}
              {item.time ? (
                <p className="wsite-schedule__time">{item.time}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

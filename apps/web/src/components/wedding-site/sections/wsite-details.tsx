type DetailItem = {
  title: string;
  text: string;
};

type Props = {
  title: string;
  items: DetailItem[];
};

export function WsiteDetails({ title, items }: Props) {
  if (!items.length) return null;

  return (
    <section className="wsite-details">
      <div className="wsite-details__inner">
        <h2 className="wsite-details__title">{title}</h2>
        <div className="wsite-details__grid">
          {items.map((item, index) => (
            <article key={item.title} className="wsite-details__item">
              <p className="wsite-details__mark" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="wsite-details__name">{item.title}</h3>
              <p className="wsite-details__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

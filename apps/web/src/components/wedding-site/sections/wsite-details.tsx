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
    <section className="wsite-section wsite-section--soft wsite-details">
      <div className="wsite-section__inner">
        <h2 className="wsite-section__title wsite-details__title">{title}</h2>
        <div className="wsite-details__grid">
          {items.map((item) => (
            <article key={item.title} className="wsite-details__item">
              <span className="wsite-details__mark" aria-hidden />
              <h3 className="wsite-details__name">{item.title}</h3>
              <p className="wsite-details__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

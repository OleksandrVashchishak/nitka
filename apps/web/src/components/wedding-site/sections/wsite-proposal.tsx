/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string;
  body: string;
  imageUrl?: string;
};

export function WsiteProposal({ title, body, imageUrl }: Props) {
  const paragraphs = body.split(/\n+/).filter(Boolean);
  if (!paragraphs.length && !imageUrl) return null;

  return (
    <section className="wsite-section wsite-section--dark wsite-proposal">
      <div className="wsite-section__inner">
        <div className="wsite-proposal__grid">
          <div className="wsite-proposal__photo">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="wsite-proposal__img" />
            ) : null}
          </div>
          <div className="wsite-proposal__copy">
            <p className="wsite-section__eyebrow">Історія</p>
            <h2 className="wsite-section__title wsite-proposal__title">{title}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="wsite-section__text wsite-proposal__text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string;
  body: string;
  imageUrl?: string;
  eyebrow?: string;
};

export function WsiteStory({
  title,
  body,
  imageUrl,
  eyebrow = "Історія кохання",
}: Props) {
  const paragraphs = body.split(/\n+/).filter(Boolean);
  if (!paragraphs.length && !imageUrl) return null;

  return (
    <section className="wsite-story">
      <div className="wsite-story__copy">
        <p className="wsite-story__eyebrow">{eyebrow}</p>
        <div className="wsite-story__heading">
          <h2 className="wsite-story__title">{title}</h2>
          <div className="wsite-story__text">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="wsite-story__media" aria-hidden>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="wsite-story__img" />
        ) : null}
      </div>
    </section>
  );
}

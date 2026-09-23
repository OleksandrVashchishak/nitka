/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string;
  body: string;
  imageLeft?: string;
  imageRight?: string;
  eyebrow?: string;
};

export function WsiteProposal({
  title,
  body,
  imageLeft,
  imageRight,
  eyebrow = "Наша мить",
}: Props) {
  const paragraphs = body.split(/\n+/).filter(Boolean);
  const primaryImage = imageLeft || imageRight;
  const secondaryImage =
    imageLeft && imageRight && imageRight !== imageLeft
      ? imageRight
      : undefined;

  if (!paragraphs.length && !primaryImage) return null;

  return (
    <section className="wsite-proposal">
      <div className="wsite-proposal__inner">
        {primaryImage ? (
          <div className="wsite-proposal__photo wsite-proposal__photo--left">
            <img src={primaryImage} alt="" className="wsite-proposal__img" />
          </div>
        ) : null}

        <div className="wsite-proposal__heading">
          {eyebrow ? (
            <p className="wsite-proposal__eyebrow">{eyebrow}</p>
          ) : null}
          {title ? (
            <h2 className="wsite-proposal__title">{title}</h2>
          ) : null}
        </div>

        {paragraphs.length ? (
          <div className="wsite-proposal__text">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {secondaryImage ? (
          <div className="wsite-proposal__photo wsite-proposal__photo--right">
            <img
              src={secondaryImage}
              alt=""
              className="wsite-proposal__img"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

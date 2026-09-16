/* eslint-disable @next/next/no-img-element */

type Props = {
  names: string;
  meta?: string;
  imageUrl: string;
  compact?: boolean;
};

export function WsiteHero({ names, meta, imageUrl, compact }: Props) {
  return (
    <header
      className={`wsite-hero${compact ? " wsite-hero--compact" : ""}`}
    >
      <div className="wsite-hero__media" aria-hidden>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="wsite-hero__img" />
        ) : null}
        <div className="wsite-hero__shade" />
      </div>
      <div className="wsite-hero__content">
        <h1 className="wsite-hero__names">{names}</h1>
        {meta ? <p className="wsite-hero__meta">{meta}</p> : null}
      </div>
    </header>
  );
}

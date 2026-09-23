/* eslint-disable @next/next/no-img-element */

type Props = {
  names: string;
  initials?: string;
  date?: string;
  invite?: string;
  imageUrl: string;
  compact?: boolean;
};

const DEFAULT_INVITE =
  "Запрошуємо розділити з нами мить початку нашої сім’ї";

function HourglassIcon() {
  return (
    <svg
      className="wsite-hero__scroll-icon"
      viewBox="0 0 14 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M7 1.5C4.2 1.5 2 3.4 2 6.2c0 2.3 1.5 4.1 3.4 5.3L7 13l1.6-1.5C10.5 10.3 12 8.5 12 6.2 12 3.4 9.8 1.5 7 1.5ZM7 31.5c2.8 0 5-1.9 5-4.7 0-2.3-1.5-4.1-3.4-5.3L7 20l-1.6 1.5C3.5 22.7 2 24.5 2 26.8c0 2.8 2.2 4.7 5 4.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WsiteHero({
  names,
  initials,
  date,
  invite = DEFAULT_INVITE,
  imageUrl,
  compact,
}: Props) {
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

      {!compact && (initials || date) ? (
        <div className="wsite-hero__top">
          {initials ? (
            <span className="wsite-hero__initials">{initials}</span>
          ) : (
            <span />
          )}
          {date ? <span className="wsite-hero__date">{date}</span> : null}
        </div>
      ) : null}

      <div className="wsite-hero__content">
        <h1 className="wsite-hero__names">{names}</h1>
        {!compact ? (
          <>
            <div className="wsite-hero__rule" aria-hidden />
            {invite ? <p className="wsite-hero__invite">{invite}</p> : null}
          </>
        ) : null}
      </div>

      {!compact ? (
        <div className="wsite-hero__scroll" aria-hidden>
          <HourglassIcon />
        </div>
      ) : null}
    </header>
  );
}

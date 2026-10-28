/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string;
  names: string;
  imageUrl?: string;
};

function HeartIcon() {
  return (
    <svg
      className="wsite-closing__heart-icon"
      width="64"
      height="48"
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M7.04023 6.90356C22.2782 -10.2255 23.2204 8.51516 21.7867 20.0266C33.7682 12.6597 60.737 -0.164516 62.2117 8.67578C65.4068 14.4775 62.1346 18.7605 61.4177 20.0266C55.2734 25.5523 31.1875 38.8829 12.2629 48C13.799 24.5167 -12.0073 28.3148 7.04023 6.90356Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WsiteClosing({ title, names, imageUrl }: Props) {
  return (
    <section className="wsite-closing">
      <div className="wsite-closing__inner">
        {imageUrl ? (
          <div className="wsite-closing__photo">
            <img src={imageUrl} alt="" className="wsite-closing__img" />
          </div>
        ) : null}

        <h2 className="wsite-closing__title">{title}</h2>

        <div className="wsite-closing__heart" aria-hidden>
          <HeartIcon />
        </div>

        <p className="wsite-closing__names">{names}</p>
      </div>

      <div className="wsite-closing__bar">
        <span>Зроблено з любовʼю у </span>
        <a
          className="wsite-closing__brand"
          href="https://fata.studio"
          target="_blank"
          rel="noreferrer"
        >
          fata.studio
          <span className="wsite-closing__dot" aria-hidden />
        </a>
      </div>
    </section>
  );
}

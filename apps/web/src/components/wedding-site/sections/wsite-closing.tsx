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
      width="28"
      height="26"
      viewBox="0 0 28 26"
      fill="none"
      aria-hidden
    >
      <path
        d="M14 23.5C14 23.5 2.5 16.2 2.5 9.2 2.5 5.4 5.4 2.5 9 2.5c2.1 0 3.9 1 5 2.5 1.1-1.5 2.9-2.5 5-2.5 3.6 0 6.5 2.9 6.5 6.7 0 7-11.5 14.3-11.5 14.3Z"
        fill="currentColor"
        transform="rotate(-12 14 13)"
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

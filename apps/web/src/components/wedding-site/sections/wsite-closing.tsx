type Props = {
  title: string;
  text: string;
  year?: string;
};

export function WsiteClosing({ title, text, year }: Props) {
  return (
    <section className="wsite-section wsite-section--soft wsite-closing">
      <div className="wsite-section__inner">
        <svg
          className="wsite-closing__ornament"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden
        >
          <path
            d="M24 40c0-10 8-16 8-24 0-5-3-8-8-8s-8 3-8 8c0 8 8 14 8 24Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M16 22c-4 1-7 5-7 9M32 22c4 1 7 5 7 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <h2 className="wsite-section__title wsite-closing__title">{title}</h2>
        {text ? <p className="wsite-section__text wsite-closing__text">{text}</p> : null}
      </div>
      <div className="wsite-closing__bar">{year || new Date().getFullYear()}</div>
    </section>
  );
}

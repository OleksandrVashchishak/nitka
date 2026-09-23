type Props = {
  title: string;
  body: string;
  href: string;
  deadline?: string;
};

function SparkIcon() {
  return (
    <svg
      className="wsite-rsvp__spark-icon"
      width="48"
      height="48"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M9 0.5L10.2 7.8L17.5 9L10.2 10.2L9 17.5L7.8 10.2L0.5 9L7.8 7.8L9 0.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WsiteRsvp({
  title,
  body,
  href,
  deadline = "До відповіді",
}: Props) {
  return (
    <section className="wsite-rsvp">
      <div className="wsite-rsvp__inner">
        <div className="wsite-rsvp__heading">
          <p className="wsite-rsvp__eyebrow">{deadline}</p>
          <h2 className="wsite-rsvp__title">{title}</h2>
        </div>
        <div className="wsite-rsvp__spark" aria-hidden>
          <SparkIcon />
        </div>
        {body ? <p className="wsite-rsvp__text">{body}</p> : null}
        <div className="wsite-rsvp__actions">
          <a className="wsite-rsvp__btn wsite-rsvp__btn--yes" href={href}>
            Я буду
          </a>
          <a className="wsite-rsvp__btn wsite-rsvp__btn--no" href={href}>
            Мене не буде
          </a>
        </div>
      </div>
    </section>
  );
}

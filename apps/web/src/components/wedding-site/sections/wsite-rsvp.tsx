type Props = {
  title: string;
  body: string;
  href: string;
};

export function WsiteRsvp({ title, body, href }: Props) {
  return (
    <section className="wsite-section wsite-section--accent wsite-rsvp">
      <div className="wsite-section__inner">
        <div className="wsite-rsvp__copy">
          <p className="wsite-section__eyebrow">Для гостей</p>
          <h2 className="wsite-section__title wsite-rsvp__title">{title}</h2>
          {body ? <p className="wsite-section__text wsite-rsvp__text">{body}</p> : null}
        </div>
        <div className="wsite-rsvp__actions">
          <a className="wsite-rsvp__btn wsite-rsvp__btn--yes" href={href}>
            Підтвердити присутність
          </a>
          <a className="wsite-rsvp__btn wsite-rsvp__btn--no" href={href}>
            На жаль, не зможу
          </a>
        </div>
      </div>
    </section>
  );
}

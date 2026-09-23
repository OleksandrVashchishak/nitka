/* eslint-disable @next/next/no-img-element */

type Person = {
  name: string;
  bio?: string;
  imageUrl?: string;
};

type Props = {
  people: [Person, Person];
};

function SparkIcon() {
  return (
    <svg
      className="wsite-couple__spark-icon"
      width="18"
      height="18"
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

export function WsiteCouple({ people }: Props) {
  const [left, right] = people;

  return (
    <section className="wsite-couple">
      <div className="wsite-couple__inner">
        <article className="wsite-couple__col wsite-couple__col--photo-first">
          <div className="wsite-couple__photo">
            {left.imageUrl ? (
              <img
                src={left.imageUrl}
                alt={left.name}
                className="wsite-couple__img"
              />
            ) : null}
          </div>
          <h3 className="wsite-couple__name">{left.name}</h3>
          {left.bio?.trim() ? (
            <p className="wsite-couple__bio">{left.bio}</p>
          ) : null}
        </article>

        <div className="wsite-couple__spark" aria-hidden>
          <SparkIcon />
        </div>

        <article className="wsite-couple__col wsite-couple__col--text-first">
          <h3 className="wsite-couple__name">{right.name}</h3>
          {right.bio?.trim() ? (
            <p className="wsite-couple__bio">{right.bio}</p>
          ) : null}
          <div className="wsite-couple__photo">
            {right.imageUrl ? (
              <img
                src={right.imageUrl}
                alt={right.name}
                className="wsite-couple__img"
              />
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}

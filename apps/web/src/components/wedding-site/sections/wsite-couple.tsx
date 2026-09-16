/* eslint-disable @next/next/no-img-element */

type Person = {
  name: string;
  bio?: string;
  imageUrl?: string;
};

type Props = {
  people: [Person, Person];
};

export function WsiteCouple({ people }: Props) {
  return (
    <section className="wsite-section wsite-couple">
      <div className="wsite-section__inner">
        <div className="wsite-couple__grid">
          {people.map((person) => (
            <article key={person.name} className="wsite-couple__card">
              <div className="wsite-couple__photo">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="wsite-couple__img"
                  />
                ) : null}
              </div>
              <h3 className="wsite-couple__name">{person.name}</h3>
              {person.bio?.trim() ? (
                <p className="wsite-couple__bio">{person.bio}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

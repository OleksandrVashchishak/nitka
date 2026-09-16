/* eslint-disable @next/next/no-img-element */

type Props = {
  title: string;
  body: string;
  mainImage?: string;
  sideImages?: string[];
};

export function WsiteStory({ title, body, mainImage, sideImages = [] }: Props) {
  const shots = sideImages.filter(Boolean).slice(0, 2);
  const paragraphs = body.split(/\n+/).filter(Boolean);

  return (
    <section className="wsite-section wsite-section--alt wsite-story">
      <div className="wsite-section__inner">
        <div className="wsite-story__grid">
          <div className="wsite-story__col">
            <h2 className="wsite-section__title wsite-story__title">{title}</h2>
            {mainImage ? (
              <div className="wsite-story__main">
                <img src={mainImage} alt="" className="wsite-story__main-img" />
              </div>
            ) : null}
          </div>

          <div className="wsite-story__col">
            <div className="wsite-story__copy">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="wsite-section__text">
                  {paragraph}
                </p>
              ))}
            </div>
            {shots.length ? (
              <div className="wsite-story__stack">
                {shots.map((src) => (
                  <div key={src} className="wsite-story__shot">
                    <img src={src} alt="" className="wsite-story__shot-img" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

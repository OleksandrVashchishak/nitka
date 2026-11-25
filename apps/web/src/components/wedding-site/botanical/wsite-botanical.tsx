/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import {
  BotanicalOrnament,
  type BotanicalOrnamentName,
} from "@/components/wedding-site/botanical/botanical-ornament";
import { WsiteBotCountdown } from "@/components/wedding-site/botanical/wsite-bot-countdown";
import type { WebsiteContent, WebsiteSections } from "@/lib/website-api";

/** Демо-фото з макета Figma «Ботанічний v2». */
const DEMO = {
  cover: "/wedding-site/botanical/cover.jpg",
  schedule: "/wedding-site/botanical/schedule.jpg",
  story: "/wedding-site/botanical/story.jpg",
  bride: "/wedding-site/botanical/bride.jpg",
  groom: "/wedding-site/botanical/groom.jpg",
  proposalLeft: "/wedding-site/botanical/proposal-left.jpg",
  proposalRight: "/wedding-site/botanical/proposal-right.jpg",
  final: "/wedding-site/botanical/final.jpg",
} as const;

const INVITE = "Запрошуємо розділити з нами мить початку нашої сім’ї";
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const DETAIL_ORNAMENTS: BotanicalOrnamentName[] = [
  "wild",
  "lavender",
  "olive",
  "wild",
];

type DetailItem = { title: string; text: string };

type Props = {
  content: WebsiteContent;
  sections: WebsiteSections;
  bride: string;
  groom: string;
  initials: string;
  date: string;
  targetDate: Date | null;
  detailItems: DetailItem[];
  showProposal: boolean;
  compact?: boolean;
};

function Paragraphs({ text, className }: { text: string; className: string }) {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return null;
  return (
    <div className={className}>
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function Arch({
  src,
  className,
  children,
}: {
  src: string;
  className: string;
  children?: ReactNode;
}) {
  return (
    <div className={`wsite-bot-arch ${className}`}>
      <img src={src} alt="" className="wsite-bot-arch__img" />
      {children}
    </div>
  );
}

function Cover({
  names,
  initials,
  date,
  imageUrl,
  compact,
}: {
  names: string;
  initials: string;
  date: string;
  imageUrl: string;
  compact?: boolean;
}) {
  return (
    <header
      className={`wsite-bot-cover${compact ? " wsite-bot-cover--compact" : ""}`}
    >
      <div className="wsite-bot-cover__stage">
        {!compact ? (
          <div className="wsite-bot-cover__top">
            <span>{initials}</span>
            <span>{date}</span>
          </div>
        ) : null}
        <Arch src={imageUrl} className="wsite-bot-cover__arch" />
        <h1 className="wsite-bot-cover__names">{names}</h1>
        {/* Та сама назва світлим кольором, обрізана по фото: як names-overlay у макеті */}
        <div className="wsite-bot-cover__overlay" aria-hidden>
          <p className="wsite-bot-cover__names wsite-bot-cover__names--light">
            {names}
          </p>
        </div>
        <BotanicalOrnament
          name="lavender"
          className="wsite-bot-cover__lavender"
        />
        <BotanicalOrnament name="wild" className="wsite-bot-cover__wild" />
        {!compact ? (
          <>
            <p className="wsite-bot-cover__invite">{INVITE}</p>
            <span className="wsite-bot-cover__scroll" aria-hidden />
          </>
        ) : null}
      </div>
    </header>
  );
}

export function WsiteBotanical({
  content,
  sections,
  bride,
  groom,
  initials,
  date,
  targetDate,
  detailItems,
  showProposal,
  compact,
}: Props) {
  const gallery = content.galleryImages ?? [];
  const names = content.headline?.trim() || `${bride} & ${groom}`;
  const monogram = initials.replace(/\s+/g, "");
  const coverImage = content.heroImageUrl || DEMO.cover;

  if (compact) {
    return (
      <div className="wsite-bot wsite-bot--compact">
        <Cover
          names={names}
          initials={monogram}
          date={date}
          imageUrl={coverImage}
          compact
        />
      </div>
    );
  }

  const scheduleImage = content.coupleImageUrl || DEMO.schedule;
  const storyImage = content.storyImageUrl || DEMO.story;
  const brideImage = content.brideImageUrl || DEMO.bride;
  const groomImage = gallery[0] || DEMO.groom;
  const proposalLeft = gallery[1] || DEMO.proposalLeft;
  const proposalRight = gallery[2] || DEMO.proposalRight;
  const finalImage = content.heroImageUrl || DEMO.final;
  const people = [
    { name: bride, bio: content.subheadline, image: brideImage, mark: "wild" },
    { name: groom, bio: content.groomBio, image: groomImage, mark: "lavender" },
  ] as const;

  return (
    <div className="wsite-bot">
      <Cover
        names={names}
        initials={monogram}
        date={date}
        imageUrl={coverImage}
      />

      {content.timerEnabled && targetDate ? (
        <WsiteBotCountdown target={targetDate} />
      ) : null}

      {sections.schedule ? (
        <section className="wsite-bot-schedule">
          <div className="wsite-bot-schedule__content">
            <div className="wsite-bot-schedule__head">
              <p className="wsite-bot__eyebrow">Розклад урочистостей</p>
              <h2 className="wsite-bot__title wsite-bot-schedule__title">
                {content.scheduleTitle || "День нашого весілля"}
              </h2>
            </div>
            {content.scheduleItems.length ? (
              <ol className="wsite-bot-schedule__list">
                {content.scheduleItems.map((item, index) => (
                  <li
                    key={`${item.title}-${index}`}
                    className="wsite-bot-schedule__item"
                  >
                    <p className="wsite-bot-schedule__time">{item.time}</p>
                    <span className="wsite-bot-schedule__marker" aria-hidden />
                    <div className="wsite-bot-schedule__body">
                      <h3 className="wsite-bot-schedule__name">
                        {item.title || `Подія ${index + 1}`}
                      </h3>
                      {item.detail ? (
                        <p className="wsite-bot-schedule__detail">
                          {item.detail}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          <Arch src={scheduleImage} className="wsite-bot-schedule__photo" />
        </section>
      ) : null}

      {sections.story ? (
        <section className="wsite-bot-story">
          <BotanicalOrnament name="lily" className="wsite-bot-story__bg" />
          <figure className="wsite-bot-story__card">
            <img src={storyImage} alt="" className="wsite-bot-story__img" />
            <BotanicalOrnament
              name="olive"
              className="wsite-bot-story__card-olive"
            />
          </figure>
          <div className="wsite-bot-story__text">
            <p className="wsite-bot__eyebrow wsite-bot__eyebrow--light">
              Історія кохання
            </p>
            <h2 className="wsite-bot__title wsite-bot__title--light">
              {content.storyTitle || "Наша історія"}
            </h2>
            <BotanicalOrnament name="olive" className="wsite-bot-story__olive" />
            <Paragraphs
              text={content.storyBody}
              className="wsite-bot-story__body"
            />
          </div>
        </section>
      ) : null}

      {sections.story ? (
        <section className="wsite-bot-couple">
          {people.map((person, index) => (
            <div
              key={index}
              className={`wsite-bot-couple__profile wsite-bot-couple__profile--${
                index === 0 ? "first" : "second"
              }`}
            >
              <Arch src={person.image} className="wsite-bot-couple__photo" />
              <div className="wsite-bot-couple__label">
                <BotanicalOrnament
                  name={person.mark}
                  className={`wsite-bot-couple__mark wsite-bot-couple__mark--${person.mark}`}
                />
                <h3 className="wsite-bot-couple__name">{person.name}</h3>
                {person.bio?.trim() ? (
                  <p className="wsite-bot-couple__bio">{person.bio}</p>
                ) : null}
              </div>
            </div>
          ))}
          <p className="wsite-bot-couple__amp" aria-hidden>
            &amp;
          </p>
        </section>
      ) : null}

      {showProposal ? (
        <section className="wsite-bot-proposal">
          <BotanicalOrnament name="lily" className="wsite-bot-proposal__bg" />
          <div className="wsite-bot-proposal__text">
            <p className="wsite-bot__eyebrow">Наша мить</p>
            <h2 className="wsite-bot__title wsite-bot-proposal__title">
              Як відбулася пропозиція
            </h2>
            <BotanicalOrnament
              name="olive"
              className="wsite-bot-proposal__olive"
            />
            <Paragraphs
              text={content.proposalBody}
              className="wsite-bot-proposal__body"
            />
          </div>
          <div className="wsite-bot-proposal__photos">
            <figure className="wsite-bot-proposal__card wsite-bot-proposal__card--left">
              <img src={proposalLeft} alt="" />
            </figure>
            <figure className="wsite-bot-proposal__card wsite-bot-proposal__card--right">
              <img src={proposalRight} alt="" />
            </figure>
            <BotanicalOrnament
              name="lavender"
              className="wsite-bot-proposal__lavender"
            />
          </div>
        </section>
      ) : null}

      {detailItems.length ? (
        <section className="wsite-bot-details">
          <div className="wsite-bot-details__head">
            <BotanicalOrnament
              name="emblem"
              className="wsite-bot-details__emblem"
            />
            <h2 className="wsite-bot__title wsite-bot-details__title">
              Деталі весілля
            </h2>
          </div>
          <div className="wsite-bot-details__grid">
            {detailItems.map((item, index) => {
              const mark = DETAIL_ORNAMENTS[index % DETAIL_ORNAMENTS.length];
              return (
                <article key={item.title} className="wsite-bot-details__card">
                  <div className="wsite-bot-details__card-top">
                    <span className="wsite-bot-details__num" aria-hidden>
                      {ROMAN[index] ?? index + 1}
                    </span>
                    <BotanicalOrnament
                      name={mark}
                      className={`wsite-bot-details__mark wsite-bot-details__mark--${mark}`}
                    />
                  </div>
                  <h3 className="wsite-bot-details__name">{item.title}</h3>
                  <p className="wsite-bot-details__text">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {sections.rsvp ? (
        <section className="wsite-bot-rsvp">
          <BotanicalOrnament name="lily" className="wsite-bot-rsvp__bg" />
          {content.rsvpDeadline?.trim() ? (
            <p className="wsite-bot__eyebrow wsite-bot__eyebrow--light">
              До {content.rsvpDeadline.trim()}
            </p>
          ) : null}
          <h2 className="wsite-bot__title wsite-bot__title--light wsite-bot-rsvp__title">
            Підтвердіть вашу присутність
          </h2>
          <BotanicalOrnament name="emblem" className="wsite-bot-rsvp__emblem" />
          {content.rsvpBody?.trim() ? (
            <p className="wsite-bot-rsvp__body">{content.rsvpBody}</p>
          ) : null}
        </section>
      ) : null}

      <section className="wsite-bot-final">
        <Arch src={finalImage} className="wsite-bot-final__photo" />
        <h2 className="wsite-bot__title wsite-bot-final__title">
          Дуже чекаємо вас на нашому святі
        </h2>
        <BotanicalOrnament name="olive" className="wsite-bot-final__olive" />
        <p className="wsite-bot-final__names">{`${bride} & ${groom}`}</p>
      </section>

      <footer className="wsite-bot-footer">
        <span>Зроблено з любовʼю у</span>
        <a href="https://fata.studio" target="_blank" rel="noreferrer">
          <img
            src="/wedding-site/logo-fata-studio.svg"
            alt="fata.studio"
            className="wsite-bot-footer__logo"
            width={159}
            height={27}
          />
        </a>
      </footer>
    </div>
  );
}

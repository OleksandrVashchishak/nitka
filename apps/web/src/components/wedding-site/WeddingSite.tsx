import type { WebsiteContent } from "@/lib/website-api";
import { WsiteClosing } from "@/components/wedding-site/sections/wsite-closing";
import { WsiteCountdown } from "@/components/wedding-site/sections/wsite-countdown";
import { WsiteCouple } from "@/components/wedding-site/sections/wsite-couple";
import { WsiteDetails } from "@/components/wedding-site/sections/wsite-details";
import { WsiteHero } from "@/components/wedding-site/sections/wsite-hero";
import { WsiteProposal } from "@/components/wedding-site/sections/wsite-proposal";
import { WsiteRsvp } from "@/components/wedding-site/sections/wsite-rsvp";
import { WsiteSchedule } from "@/components/wedding-site/sections/wsite-schedule";
import { WsiteStory } from "@/components/wedding-site/sections/wsite-story";
import {
  coupleInitials,
  parseWeddingDate,
  safeHref,
  splitCoupleNames,
  themeClass,
} from "@/components/wedding-site/wsite-utils";
import "@/styles/wedding-site/index.scss";

export type WeddingSiteProps = {
  templateId: string;
  content: WebsiteContent;
  weddingDate?: string | null;
  compact?: boolean;
  cardPreview?: boolean;
};

/** Demo photos matching the Figma template mockup. */
const DEMO = {
  hero: "/wedding-site/hero.jpg",
  schedule: "/wedding-site/schedule.jpg",
  story: "/wedding-site/story.jpg",
  bride: "/wedding-site/bride.jpg",
  groom: "/wedding-site/groom.jpg",
  proposalLeft: "/wedding-site/proposal-left.jpg",
  proposalRight: "/wedding-site/proposal-right.jpg",
} as const;

export function WeddingSite({
  templateId,
  content,
  weddingDate,
  compact = false,
  cardPreview = false,
}: WeddingSiteProps) {
  const sections = content.sections ?? {
    story: true,
    schedule: true,
    dressCode: true,
    gallery: false,
    qa: false,
    travel: false,
    registry: false,
    rsvp: true,
  };

  const [bride, groom] = splitCoupleNames(content.headline);
  const heroImage = content.heroImageUrl || DEMO.hero;
  const initials = coupleInitials(bride, groom);
  const targetDate = parseWeddingDate(weddingDate, content.dateLabel);
  const mini = compact || cardPreview;

  const gallery = content.galleryImages ?? [];
  const scheduleImage = content.coupleImageUrl || DEMO.schedule;
  const storyImage = content.storyImageUrl || DEMO.story;
  const brideImage = content.coupleImageUrl || DEMO.bride;
  const groomImage = gallery[0] || DEMO.groom;
  const proposalLeft = gallery[1] || DEMO.proposalLeft;
  const proposalRight = gallery[2] || DEMO.proposalRight;
  const closingImage = content.coupleImageUrl || DEMO.schedule;

  const detailItems = [
    sections.dressCode && content.dressCodeBody.trim()
      ? { title: content.dressCodeTitle || "Дрес-код", text: content.dressCodeBody }
      : null,
    sections.registry && content.registryBody.trim()
      ? {
          title: content.registryTitle || "Побажання щодо подарунків",
          text: content.registryBody,
        }
      : null,
    sections.gallery && content.galleryTitle.trim()
      ? { title: "Діти на нашому святі", text: content.galleryTitle }
      : null,
    sections.travel && content.travelBody.trim()
      ? {
          title: content.travelTitle || "Контакти організаторів",
          text: content.travelBody,
        }
      : null,
    sections.qa && (content.qaItems[0]?.answer || "").trim()
      ? {
          title: content.qaItems[0]?.question || "Інше",
          text: content.qaItems[0].answer,
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; text: string }>;

  const showCouple = sections.story;
  const showProposal =
    sections.story && Boolean(content.proposalBody?.trim());

  const theme = themeClass(templateId);

  if (mini) {
    return (
      <div className={`wsite ${theme} wsite--compact`}>
        <WsiteHero
          names={content.headline || `${bride} & ${groom}`}
          imageUrl={heroImage}
          compact
        />
      </div>
    );
  }

  return (
    <div className={`wsite ${theme}`}>
      <WsiteHero
        names={content.headline || `${bride} & ${groom}`}
        initials={initials}
        date={content.dateLabel}
        imageUrl={heroImage}
      />

      {content.timerEnabled && targetDate ? (
        <WsiteCountdown target={targetDate} />
      ) : null}

      {sections.schedule ? (
        <WsiteSchedule
          title={content.scheduleTitle || "Деталі нашого свята"}
          items={content.scheduleItems}
          imageUrl={scheduleImage}
          dateLabel={content.dateLabel}
        />
      ) : null}

      {sections.story ? (
        <WsiteStory
          title={content.storyTitle || "Наша історія"}
          body={content.storyBody}
          imageUrl={storyImage}
        />
      ) : null}

      {showCouple ? (
        <WsiteCouple
          people={[
            {
              name: bride,
              bio: content.subheadline,
              imageUrl: brideImage,
            },
            {
              name: groom,
              bio: content.groomBio,
              imageUrl: groomImage,
            },
          ]}
        />
      ) : null}

      {showProposal ? (
        <WsiteProposal
          title="Як відбулася пропозиція"
          body={content.proposalBody}
          imageLeft={proposalLeft}
          imageRight={proposalRight}
        />
      ) : null}

      {detailItems.length ? (
        <WsiteDetails title="Деталі весілля" items={detailItems} />
      ) : null}

      {sections.rsvp ? (
        <WsiteRsvp
          title={content.rsvpTitle || "Підтвердіть свою присутність"}
          body={content.rsvpBody}
          href={safeHref(content.rsvpUrl, "#")}
        />
      ) : null}

      <WsiteClosing
        title="Дуже чекаємо вас на нашому святі!"
        names={`${bride} & ${groom}`}
        imageUrl={closingImage}
      />
    </div>
  );
}

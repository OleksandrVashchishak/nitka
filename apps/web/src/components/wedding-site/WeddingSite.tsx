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
import "@/components/wedding-site/styles/index.scss";

export type WeddingSiteProps = {
  templateId: string;
  content: WebsiteContent;
  weddingDate?: string | null;
  compact?: boolean;
  cardPreview?: boolean;
};

const FALLBACK_IMG = "/landing/couple.jpg";

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
  const heroImage =
    content.heroImageUrl || content.coupleImageUrl || FALLBACK_IMG;
  const initials = coupleInitials(bride, groom);
  const targetDate = parseWeddingDate(weddingDate, content.dateLabel);
  const mini = compact || cardPreview;

  const gallery = content.galleryImages ?? [];
  const storyMain =
    content.storyImageUrl || content.coupleImageUrl || gallery[0] || FALLBACK_IMG;

  const detailItems = [
    sections.dressCode && content.dressCodeBody.trim()
      ? { title: content.dressCodeTitle || "Дрес-код", text: content.dressCodeBody }
      : null,
    sections.registry && content.registryBody.trim()
      ? {
          title: content.registryTitle || "Що дарувати",
          text: content.registryBody,
        }
      : null,
    sections.gallery && content.galleryTitle.trim()
      ? { title: "Дитяча зона", text: content.galleryTitle }
      : null,
    sections.travel && content.travelBody.trim()
      ? {
          title: content.travelTitle || "Контакти",
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
  const proposalImage =
    gallery[1] || content.storyImageUrl || content.coupleImageUrl || FALLBACK_IMG;

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
          title={content.scheduleTitle || "День нашого весілля"}
          items={content.scheduleItems}
          imageUrl={content.coupleImageUrl || storyMain}
        />
      ) : null}

      {sections.story ? (
        <WsiteStory
          title={content.storyTitle || "Наша історія"}
          body={content.storyBody}
          imageUrl={storyMain}
        />
      ) : null}

      {showCouple ? (
        <WsiteCouple
          people={[
            {
              name: bride,
              bio: content.subheadline,
              imageUrl: content.coupleImageUrl || storyMain,
            },
            {
              name: groom,
              bio: content.groomBio,
              imageUrl: gallery[0] || gallery[1] || "/landing/feat-1.jpg",
            },
          ]}
        />
      ) : null}

      {showProposal ? (
        <WsiteProposal
          title="Як відбулася пропозиція"
          body={content.proposalBody}
          imageLeft={proposalImage}
          imageRight={gallery[2] || gallery[0] || storyMain}
        />
      ) : null}

      {detailItems.length ? (
        <WsiteDetails title="Деталі весілля" items={detailItems} />
      ) : null}

      {sections.rsvp ? (
        <WsiteRsvp
          title={content.rsvpTitle || "Коли треба дати відповідь"}
          body={content.rsvpBody}
          href={safeHref(content.rsvpUrl, "#")}
        />
      ) : null}

      <WsiteClosing
        title="Дуже чекаємо вас на нашому святі"
        names={`${bride} & ${groom}`}
        imageUrl={gallery[1] || content.coupleImageUrl || storyMain}
      />
    </div>
  );
}

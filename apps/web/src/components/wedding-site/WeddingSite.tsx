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
  const meta = [content.dateLabel, content.cityLabel].filter(Boolean).join(" — ");
  const targetDate = parseWeddingDate(weddingDate, content.dateLabel);
  const mini = compact || cardPreview;

  const gallery = content.galleryImages ?? [];
  const storyMain =
    content.storyImageUrl || content.coupleImageUrl || gallery[0] || FALLBACK_IMG;
  const storySide = [
    gallery[0] || "/landing/hero-photo.jpg",
    gallery[1] || "/landing/compare-1.jpg",
  ];

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
          meta={meta}
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
        meta={meta}
        imageUrl={heroImage}
      />

      {content.timerEnabled && targetDate ? (
        <WsiteCountdown target={targetDate} />
      ) : null}

      {sections.schedule ? (
        <WsiteSchedule
          title={content.scheduleTitle || "День нашого весілля"}
          items={content.scheduleItems}
        />
      ) : null}

      {sections.story ? (
        <WsiteStory
          title={content.storyTitle || "Наша історія"}
          body={content.storyBody}
          mainImage={storyMain}
          sideImages={storySide}
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
              imageUrl: gallery[0] || "/landing/feat-1.jpg",
            },
          ]}
        />
      ) : null}

      {showProposal ? (
        <WsiteProposal
          title="Як відбулася пропозиція"
          body={content.proposalBody}
          imageUrl={proposalImage}
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
        text={
          content.footerNote ||
          `До зустрічі${content.cityLabel ? ` в ${content.cityLabel}` : ""}, з любовʼю, ${bride} та ${groom}`
        }
        year={targetDate ? String(targetDate.getFullYear()) : undefined}
      />
    </div>
  );
}

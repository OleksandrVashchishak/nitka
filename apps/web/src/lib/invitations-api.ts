import { apiFetch } from "@/lib/client-api";

export type InvitationContent = {
  headline: string;
  opener: string;
  body: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  dressCode: string;
  rsvpNote: string;
  coverImageUrl: string;
  showWebsiteLink: boolean;
};

export type InvitationTemplateMeta = {
  id: string;
  name: string;
  description: string;
};

export type InvitationMineResponse = {
  invitation: {
    templateId: string;
    content: InvitationContent;
    updatedAt: string | null;
  };
  wedding: {
    id: string;
    date: string;
    city: string;
    coupleName: string;
  };
  website: { slug: string; url: string } | null;
  guestsPreview: Array<{
    id: string;
    name: string;
    inviteToken: string;
    rsvpStatus: string;
  }>;
  guestsTotal: number;
  templates: InvitationTemplateMeta[];
};

export function normalizeInvitationContent(
  raw?: Partial<InvitationContent> | null,
  fallback?: Partial<InvitationContent>,
): InvitationContent {
  return {
    headline: String(raw?.headline ?? fallback?.headline ?? "Імена пари"),
    opener: String(
      raw?.opener ?? fallback?.opener ?? "Запрошуємо розділити наш день",
    ),
    body: String(
      raw?.body ??
        fallback?.body ??
        "Будемо раді бачити вас на нашому весіллі.",
    ),
    dateLabel: String(raw?.dateLabel ?? fallback?.dateLabel ?? ""),
    timeLabel: String(raw?.timeLabel ?? fallback?.timeLabel ?? ""),
    venue: String(raw?.venue ?? fallback?.venue ?? ""),
    address: String(raw?.address ?? fallback?.address ?? ""),
    dressCode: String(raw?.dressCode ?? fallback?.dressCode ?? ""),
    rsvpNote: String(
      raw?.rsvpNote ??
        fallback?.rsvpNote ??
        "Будь ласка, підтвердіть участь.",
    ),
    coverImageUrl: String(raw?.coverImageUrl ?? fallback?.coverImageUrl ?? ""),
    showWebsiteLink: Boolean(
      raw?.showWebsiteLink ?? fallback?.showWebsiteLink ?? true,
    ),
  };
}

export function getMyInvitation() {
  return apiFetch<InvitationMineResponse>("/api/invitations/me");
}

export function upsertMyInvitation(input: {
  templateId?: string;
  content?: InvitationContent;
}) {
  return apiFetch<{
    invitation: InvitationMineResponse["invitation"];
    templates: InvitationTemplateMeta[];
  }>("/api/invitations/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

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

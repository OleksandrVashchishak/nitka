export const ONBOARDING_DRAFT_KEY = "fata-onboarding-v1";

export type OnboardingScreen = 1 | 2 | "2.1" | "2.2" | 3;

export type OnboardingDraft = {
  planningStage: string;
  firstName: string;
  lastName: string;
  partnerFirstName: string;
  partnerLastName: string;
  date: string;
  dateUndecided: boolean;
  city: string;
  cityUndecided: boolean;
  guestBand: string;
  referral: string;
  screen: OnboardingScreen;
  accountSaved: boolean;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function isScreen(value: unknown): value is OnboardingScreen {
  return value === 1 || value === 2 || value === "2.1" || value === "2.2" || value === 3;
}

export function loadOnboardingDraft(): OnboardingDraft | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
    if (!parsed || !isScreen(parsed.screen)) return null;
    return {
      planningStage: parsed.planningStage ?? "PLANNING_WITH_VENUE",
      firstName: parsed.firstName ?? "",
      lastName: parsed.lastName ?? "",
      partnerFirstName: parsed.partnerFirstName ?? "",
      partnerLastName: parsed.partnerLastName ?? "",
      date: parsed.date ?? "",
      dateUndecided: Boolean(parsed.dateUndecided),
      city: parsed.city ?? "",
      cityUndecided: Boolean(parsed.cityUndecided),
      guestBand: parsed.guestBand ?? "",
      referral: parsed.referral ?? "",
      screen: parsed.screen,
      accountSaved: Boolean(parsed.accountSaved),
    };
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft));
}

export function clearOnboardingDraft() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
}

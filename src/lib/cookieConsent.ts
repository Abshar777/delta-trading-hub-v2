export interface CookieConsent {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const STORAGE_KEY = "delta-cookie-consent";
export const COOKIE_CONSENT_EVENT = "delta-cookie-consent-changed";
export const OPEN_COOKIE_PREFERENCES_EVENT = "delta-open-cookie-preferences";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return {
      necessary: true,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookieConsent(
  prefs: Pick<CookieConsent, "functional" | "analytics" | "marketing">
): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    ...prefs,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* localStorage unavailable — consent just won't persist across visits */
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  return consent;
}

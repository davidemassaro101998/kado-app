// Shared platform checks used by both the PWA install flow
// (SecurityShieldAndPwa) and anything that needs to warn the user their
// locally-saved data is at risk (ResultsDeckApple's reminder confirmation).

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

// True when localStorage is at real risk of silent eviction: Safari's ITP
// clears all script-writable storage (including localStorage) after 7 days
// with no user interaction on the site — UNLESS the site is running as a
// Home Screen web app, which is explicitly exempt from that policy. This
// matters here specifically because saved reminders are meant to survive
// months, not a week, and there is no way to warn the user after the fact —
// the data is just silently gone by the time the reminder would fire.
export function isAtRiskOfStorageEviction(): boolean {
  return isIos() && !isStandalone();
}

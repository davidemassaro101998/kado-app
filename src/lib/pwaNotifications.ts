// Kado AI - PWA Smart Notification Infrastructure

import { SavedReminder } from "../types";

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register Service Worker if supported by browser
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    swRegistration = reg;
    console.log("Kado AI Service Worker registered successfully.");
    return reg;
  } catch (err) {
    console.warn("Service Worker registration failed:", err);
    return null;
  }
}

/**
 * Request Notification Permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (e) {
      console.warn("Error requesting notification permission:", e);
    }
  }

  return false;
}

/**
 * Interface for Dispatching Notifications
 */
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag: string;
  vibrate?: number[];
  actions?: Array<{ action: string; title: string }>;
  data?: Record<string, any>;
}

/**
 * Send Web Push Notification via ServiceWorker or Fallback Notification API
 */
export async function dispatchPwaNotification(payload: NotificationPayload): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  const defaultVibrate = [200, 100, 200];
  const icon = payload.icon || "/icon.svg";
  const badge = payload.badge || "/favicon.ico";

  // Trigger native vibration if supported
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(payload.vibrate || defaultVibrate);
    } catch (e) {
      // ignore
    }
  }

  // 1. Prefer Service Worker registration showNotification
  try {
    if (!swRegistration && "serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.ready.catch(() => null);
    }

    if (swRegistration && "showNotification" in swRegistration) {
      await swRegistration.showNotification(payload.title, {
        body: payload.body,
        icon,
        badge,
        tag: payload.tag,
        vibrate: payload.vibrate || defaultVibrate,
        actions: payload.actions,
        data: payload.data || { url: "/" },
        requireInteraction: true,
      } as NotificationOptions);
      return true;
    }
  } catch (err) {
    console.warn("SW showNotification failed, using fallback Notification API:", err);
  }

  // 2. Fallback to standard Browser Notification constructor
  try {
    const n = new Notification(payload.title, {
      body: payload.body,
      icon,
      badge,
      tag: payload.tag,
      data: payload.data || { url: "/" },
    });

    n.onclick = () => {
      window.focus();
      if (payload.data?.url) {
        window.location.href = payload.data.url;
      }
      n.close();
    };
    return true;
  } catch (err) {
    console.error("Failed to display notification:", err);
    return false;
  }
}

/**
 * Prevent sending the same notification tag on the same calendar day
 */
function hasBeenSentToday(tag: string): boolean {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const key = `kado_sent_notif_${tag}_${todayStr}`;
    return localStorage.getItem(key) === "true";
  } catch (e) {
    return false;
  }
}

function markAsSentToday(tag: string): void {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const key = `kado_sent_notif_${tag}_${todayStr}`;
    localStorage.setItem(key, "true");
  } catch (e) {
    // ignore
  }
}

// Permanent (not date-scoped) dedup for the per-reminder tiers below — see
// checkSavedEventNotifications for why this needs to differ from the
// same-day dedup above.
function hasBeenSentEver(tag: string): boolean {
  try {
    return localStorage.getItem(`kado_sent_notif_ever_${tag}`) === "true";
  } catch (e) {
    return false;
  }
}

function markAsSentEver(tag: string): void {
  try {
    localStorage.setItem(`kado_sent_notif_ever_${tag}`, "true");
  } catch (e) {
    // ignore
  }
}

interface ReminderTier {
  days: number;
  key: string;
  build: (name: string, relation: string) => Omit<NotificationPayload, "tag">;
}

// Ordered least urgent -> most urgent on purpose: when picking which
// single tier to actually notify about (see below), we want the smallest
// .days among the crossed-but-unsent ones, and this order makes that a
// simple "last crossed wins" reduction.
const REMINDER_TIERS: ReminderTier[] = [
  {
    days: 14,
    key: "14d",
    build: (name, relation) => ({
      title: `🎁 Tra 14 giorni è il compleanno di ${name}!`,
      body: `Zero fretta, massima resa. Scopri ora le 3 idee perfette e approfitta della spedizione standard.`,
      actions: [{ action: "find_gift", title: "Trova Regalo" }],
      data: { url: `/?action=find_gift&recipient=${encodeURIComponent(relation || name)}&name=${encodeURIComponent(name)}` },
    }),
  },
  {
    days: 7,
    key: "7d",
    build: (name, relation) => ({
      title: `⏰ Manca solo 1 settimana per ${name}!`,
      body: `Non ridurti all'ultimo secondo. L'AI ha selezionato 3 regali con 5 stelle su Amazon per lui.`,
      actions: [{ action: "find_gift", title: "Vedi le 3 Idee" }],
      data: { url: `/?action=find_gift&recipient=${encodeURIComponent(relation || name)}&name=${encodeURIComponent(name)}` },
    }),
  },
  {
    days: 3,
    key: "3d",
    build: (name, relation) => ({
      title: `🚨 SOS Regalo per ${name}!`,
      body: `Mancano 3 giorni! Ordina oggi con Amazon Prime per farlo arrivare in tempo senza fare brutta figura.`,
      actions: [{ action: "find_gift", title: "Risolvi in 3 Tap" }],
      data: { url: `/?action=find_gift&recipient=${encodeURIComponent(relation || name)}&name=${encodeURIComponent(name)}` },
    }),
  },
];

/**
 * Check Saved Event Reminders (14 days, 7 days, 3 days).
 *
 * This only runs when the app happens to be open — there is no server-side
 * push scheduler behind it — so it CANNOT rely on catching the user on the
 * exact day a threshold is crossed. The original version did exactly that
 * (`daysLeft === 14`), which meant: open the app on literally any other day
 * and that tier's notification never fires, ever, for that occasion — the
 * one thing "remind me next year" is supposed to guarantee. Fixed to treat
 * each tier as "crossed" once daysLeft <= tier.days, catching up on
 * whichever tiers were missed the next time the app opens, instead of
 * requiring a same-day match. To avoid bursting 3 notifications at once
 * when several tiers are caught up together, only the single most urgent
 * crossed-and-unsent tier is actually dispatched per check; the less
 * urgent ones that were also crossed are marked sent without notifying,
 * so they never fire late/out of order after a more urgent one already did.
 */
export function checkSavedEventNotifications(reminders: SavedReminder[]): void {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  reminders.forEach((rem) => {
    if (!rem.date) return;
    const parts = rem.date.split("-");
    if (parts.length !== 3) return;

    const eventDate = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    eventDate.setHours(0, 0, 0, 0);

    const diffMs = eventDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Event already happened (or is today with no earlier tier ever sent)
    // — nothing left to remind about.
    if (daysLeft < 0) return;

    const crossedUnsent = REMINDER_TIERS.filter(
      (tier) => daysLeft <= tier.days && !hasBeenSentEver(`reminder_${tier.key}_${rem.id}`)
    );
    if (crossedUnsent.length === 0) return;

    const mostUrgent = crossedUnsent.reduce((a, b) => (a.days < b.days ? a : b));
    dispatchPwaNotification({
      ...mostUrgent.build(rem.name, rem.relation),
      tag: `reminder_${mostUrgent.key}_${rem.id}`,
    });

    crossedUnsent.forEach((tier) => markAsSentEver(`reminder_${tier.key}_${rem.id}`));
  });
}

/**
 * Check Global Calendar Holidays
 */
export function checkGlobalHolidayNotifications(): void {
  const now = new Date();
  const month = now.getMonth() + 1; // 1 - 12
  const day = now.getDate(); // 1 - 31

  // 1. San Valentino (7 Febbraio -> 7 giorni prima del 14)
  if (month === 2 && day === 7) {
    const tag = "holiday_valentine_feb7";
    if (!hasBeenSentToday(tag)) {
      dispatchPwaNotification({
        title: "❤️ San Valentino si avvicina!",
        body: "Sorprendi chi ami con un'idea originale, non il solito mazzo di fiori. Trova il regalo in 3 tap.",
        tag,
        actions: [{ action: "find_gift", title: "Trova Regalo" }],
        data: { url: "/?action=find_gift&vibe=Relax" },
      });
      markAsSentToday(tag);
    }
  }

  // 2. Festa del Papà (19 Marzo -> preavviso 10 giorni prima, 9 Marzo)
  if (month === 3 && day === 9) {
    const tag = "holiday_fathers_day_mar9";
    if (!hasBeenSentToday(tag)) {
      dispatchPwaNotification({
        title: "👑 Un pensiero speciale per il Papà!",
        body: "Mostragli quanto gli vuoi bene con un regalo pensato su misura per le sue passioni.",
        tag,
        actions: [{ action: "find_gift", title: "Idea per il Papà" }],
        data: { url: "/?action=find_gift&recipient=Famiglia" },
      });
      markAsSentToday(tag);
    }
  }

  // 3. Festa della Mamma (10 giorni prima, ~28 Aprile / 1 Maggio)
  if ((month === 4 && day === 28) || (month === 5 && day === 1)) {
    const tag = "holiday_mothers_day";
    if (!hasBeenSentToday(tag)) {
      dispatchPwaNotification({
        title: "👑 Un pensiero speciale per la Mamma!",
        body: "Mostrale quanto le vuoi bene con un regalo pensato su misura per le sue passioni.",
        tag,
        actions: [{ action: "find_gift", title: "Idea per la Mamma" }],
        data: { url: "/?action=find_gift&recipient=Famiglia" },
      });
      markAsSentToday(tag);
    }
  }

  // 4. Natale (10 Dicembre)
  if (month === 12 && day === 10) {
    const tag = "holiday_christmas_dec10";
    if (!hasBeenSentToday(tag)) {
      dispatchPwaNotification({
        title: "🎄 Busta paga in salvo e regali pronti!",
        body: "Evita le file nei centri commerciali. Trova i regali di Natale per tutti in 60 secondi.",
        tag,
        actions: [{ action: "find_gift", title: "Trova Regali" }],
        data: { url: "/?action=find_gift" },
      });
      markAsSentToday(tag);
    }
  }

  // 5. Black Friday (24 ore prima - solitamente intorno al 23-28 Novembre)
  if (month === 11 && day >= 22 && day <= 27) {
    // Check if tomorrow is 4th Friday of Nov
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    if (tomorrow.getDay() === 5) { // Friday
      const tag = "holiday_black_friday";
      if (!hasBeenSentToday(tag)) {
        dispatchPwaNotification({
          title: "⚡ Sconti Black Friday sui Regali!",
          body: "Trova le migliori idee regalo in offerta speciale su Amazon prima che finiscano le scorte.",
          tag,
          actions: [{ action: "find_gift", title: "Vedi Offerte" }],
          data: { url: "/?action=find_gift" },
        });
        markAsSentToday(tag);
      }
    }
  }
}

/**
 * Trigger Instant Test Notification (for settings preview)
 */
export async function triggerTestNotification(personName = "Marco"): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) {
    alert("Per favore abilita le notifiche del browser/PWA nelle impostazioni del dispositivo per ricevere i promemoria.");
    return false;
  }

  return dispatchPwaNotification({
    title: `🎁 Tra 14 giorni è il compleanno di ${personName}!`,
    body: `Zero fretta, massima resa. Scopri ora le 3 idee perfette e approfitta della spedizione standard.`,
    tag: `test_notif_${Date.now()}`,
    vibrate: [200, 100, 200],
    actions: [{ action: "find_gift", title: "Trova Regalo" }],
    data: { url: `/?action=find_gift&recipient=Amico&name=${encodeURIComponent(personName)}` },
  });
}

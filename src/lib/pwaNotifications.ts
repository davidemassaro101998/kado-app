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

/**
 * Check Saved Event Reminders (14 days, 7 days, 3 days)
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

    const name = rem.name;

    // A. 14 GIORNI PRIMA
    if (daysLeft === 14) {
      const tag = `reminder_14d_${rem.id}`;
      if (!hasBeenSentToday(tag)) {
        dispatchPwaNotification({
          title: `🎁 Tra 14 giorni è il compleanno di ${name}!`,
          body: `Zero fretta, massima resa. Scopri ora le 3 idee perfette e approfitta della spedizione standard.`,
          tag,
          actions: [{ action: "find_gift", title: "Trova Regalo" }],
          data: { url: `/?action=find_gift&recipient=${encodeURIComponent(rem.relation || name)}&name=${encodeURIComponent(name)}` },
        });
        markAsSentToday(tag);
      }
    }

    // B. 7 GIORNI PRIMA
    if (daysLeft === 7) {
      const tag = `reminder_7d_${rem.id}`;
      if (!hasBeenSentToday(tag)) {
        dispatchPwaNotification({
          title: `⏰ Manca solo 1 settimana per ${name}!`,
          body: `Non ridurti all'ultimo secondo. L'AI ha selezionato 3 regali con 5 stelle su Amazon per lui.`,
          tag,
          actions: [{ action: "find_gift", title: "Vedi le 3 Idee" }],
          data: { url: `/?action=find_gift&recipient=${encodeURIComponent(rem.relation || name)}&name=${encodeURIComponent(name)}` },
        });
        markAsSentToday(tag);
      }
    }

    // C. 3 GIORNI PRIMA (SOS LAST MINUTE)
    if (daysLeft === 3) {
      const tag = `reminder_3d_${rem.id}`;
      if (!hasBeenSentToday(tag)) {
        dispatchPwaNotification({
          title: `🚨 SOS Regalo per ${name}!`,
          body: `Mancano 3 giorni! Ordina oggi con Amazon Prime per farlo arrivare in tempo senza fare brutta figura.`,
          tag,
          actions: [{ action: "find_gift", title: "Risolvi in 3 Tap" }],
          data: { url: `/?action=find_gift&recipient=${encodeURIComponent(rem.relation || name)}&name=${encodeURIComponent(name)}` },
        });
        markAsSentToday(tag);
      }
    }
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

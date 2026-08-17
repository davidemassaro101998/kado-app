// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkSavedEventNotifications } from "./pwaNotifications";
import type { SavedReminder } from "../types";

function dateOffsetFromToday(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function makeReminder(daysAway: number, overrides: Partial<SavedReminder> = {}): SavedReminder {
  return {
    id: "rem-1",
    name: "Marco",
    relation: "Amico",
    date: dateOffsetFromToday(daysAway),
    createdAt: Date.now(),
    ...overrides,
  };
}

function everSentKey(tier: "14d" | "7d" | "3d", id: string): string {
  return `kado_sent_notif_ever_reminder_${tier}_${id}`;
}

beforeEach(() => {
  localStorage.clear();
  // Minimal Notification stub: the real one requires a permission flow
  // and browser UI, neither of which exist in this test environment.
  // checkSavedEventNotifications only needs it to exist and not throw.
  (globalThis as any).Notification = class {
    static permission = "granted";
    constructor(_title: string, _options?: any) {}
  };
});

describe("checkSavedEventNotifications", () => {
  it("sends nothing when no threshold has been crossed yet", () => {
    checkSavedEventNotifications([makeReminder(20)]);
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBeNull();
  });

  it("marks the 14-day tier sent when opened exactly on day 14 (the original working case)", () => {
    checkSavedEventNotifications([makeReminder(14)]);
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBe("true");
    expect(localStorage.getItem(everSentKey("7d", "rem-1"))).toBeNull();
  });

  it("regression guard: still notifies for the 14-day tier even when the app is opened on a day OTHER than exactly 14 (e.g. day 10) — this is the bug that made reminders silently never fire", () => {
    checkSavedEventNotifications([makeReminder(10)]);
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBe("true");
  });

  it("catches up on a tier crossed while the app was closed for months, without also bursting every less-urgent tier as a separate notification", () => {
    // App wasn't opened again until 2 days before the event: both the
    // 14-day and 7-day thresholds were crossed unseen while it was closed.
    checkSavedEventNotifications([makeReminder(2)]);
    // Both tiers get marked sent (so neither fires late afterwards)...
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBe("true");
    expect(localStorage.getItem(everSentKey("7d", "rem-1"))).toBe("true");
    expect(localStorage.getItem(everSentKey("3d", "rem-1"))).toBe("true");
  });

  it("never re-sends a tier that was already sent on a previous check", () => {
    checkSavedEventNotifications([makeReminder(14)]);
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBe("true");

    localStorage.removeItem(everSentKey("7d", "rem-1")); // sanity: unrelated tier untouched
    checkSavedEventNotifications([makeReminder(7)]);
    // 14d stays sent from before, 7d is now newly sent — no duplicate work on 14d.
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBe("true");
    expect(localStorage.getItem(everSentKey("7d", "rem-1"))).toBe("true");
  });

  it("does nothing for an event that has already passed", () => {
    checkSavedEventNotifications([makeReminder(-5)]);
    expect(localStorage.getItem(everSentKey("14d", "rem-1"))).toBeNull();
    expect(localStorage.getItem(everSentKey("7d", "rem-1"))).toBeNull();
    expect(localStorage.getItem(everSentKey("3d", "rem-1"))).toBeNull();
  });

  it("ignores a malformed reminder date instead of throwing", () => {
    expect(() =>
      checkSavedEventNotifications([makeReminder(14, { date: "not-a-date" })])
    ).not.toThrow();
  });
});

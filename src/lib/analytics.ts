// Analytics & Key Event Tracking Utility for Kado AI

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  try {
    // 1. Google Analytics / Firebase Analytics gtag call
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    }

    // 2. dataLayer push fallback
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Dev logger
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Event]: ${eventName}`, eventParams || "");
    }
  } catch (err) {
    console.warn("Analytics tracking error:", err);
  }
};

// Typed helper functions for funnel metrics
export const trackPageViewHome = () => {
  trackEvent("page_view_home", { page_title: "Kado AI Home" });
};

export const trackWizardStep1 = (recipient: string) => {
  trackEvent("wizard_step_1_select", { recipient });
};

export const trackWizardStep2 = (vibe: string) => {
  trackEvent("wizard_step_2_select", { vibe });
};

export const trackWizardStep3 = (params: { recipient: string; vibe: string; budget: string; extraDetails?: string }) => {
  trackEvent("wizard_step_3_search", params);
};

export const trackClickAmazonAffiliate = (gift: { asin?: string; title: string; price: string }) => {
  trackEvent("click_amazon_affiliate", {
    item_id: gift.asin || gift.title,
    item_name: gift.title,
    price: gift.price,
  });
};

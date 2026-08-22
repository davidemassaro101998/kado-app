import React, { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HeaderApple } from "./components/HeaderApple";
import { HomeScreenApple } from "./components/HomeScreenApple";
import { LoadingApple3D } from "./components/LoadingApple3D";
import { ResultsDeckApple } from "./components/ResultsDeckApple";
import { SecurityShieldAndPwa } from "./components/SecurityShieldAndPwa";
import { OfflineScreenApple } from "./components/OfflineScreenApple";
import { SplashScreenApple } from "./components/SplashScreenApple";
import { OnboardingHelpModal } from "./components/OnboardingHelpModal";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { LegalModal, LegalDocType } from "./components/LegalModal";
import {
  ScreenType,
  QuizState,
  GiftItem,
  CountryConfig,
} from "./types";
import { detectUserCountry } from "./data/countries";
import { generateSmartFallbackGifts } from "./data/mockGifts";
import { Language } from "./data/translations";
import {
  registerServiceWorker,
  checkGlobalHolidayNotifications,
} from "./lib/pwaNotifications";

export default function App() {
  // Restore saved app session for background/app switch persistence
  const savedSession = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("kado_saved_session");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }, []);

  const [showSplash, setShowSplash] = useState(true);
  // First-ever launch only -- an onboarding tip that reappeared on every
  // open (including background resume) would be ignored at best and
  // actively confusing once mic permission is already granted.
  const [showOnboardingHelp, setShowOnboardingHelp] = useState(() => {
    try {
      return !localStorage.getItem("kado_onboarding_seen");
    } catch (e) {
      return false;
    }
  });
  const [screen, setScreen] = useState<ScreenType>(() => {
    if (savedSession?.screen === "results" && Array.isArray(savedSession?.gifts) && savedSession.gifts.length > 0) {
      return "results";
    }
    return "home";
  });
  const [currentCountry, setCurrentCountry] = useState<CountryConfig>(detectUserCountry());

  // Settings & Theme State - Always light mode
  const [theme, setTheme] = useState<"light">("light");

  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kado_haptic_enabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission === "granted";
      }
      return localStorage.getItem("kado_notifications_enabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  // Theme is strictly light mode
  useEffect(() => {
    try {
      localStorage.setItem("kado_theme", "light");
    } catch (e) {}
  }, []);

  // Handle Haptic Toggle
  const handleToggleHaptic = useCallback((enabled: boolean) => {
    setHapticEnabled(enabled);
    try {
      localStorage.setItem("kado_haptic_enabled", enabled ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }, []);

  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const userLang = navigator.language || "";
      return userLang.toLowerCase().includes("it") ? "it" : "en";
    } catch (e) {
      return "it";
    }
  });

  // Keep <html lang> and the meta description in sync with the selected
  // language -- both were previously hardcoded to Italian in index.html
  // and never updated, which told search engines and screen readers the
  // page was Italian even while it rendered in English.
  useEffect(() => {
    document.documentElement.lang = language;
    const desc = document.querySelector('meta[name="description"]');
    const metaDesc = language === "it"
      ? "Trova l'idea regalo ideale su Amazon con l'intelligenza artificiale. Veloce, preciso e senza stress."
      : "Find the perfect gift idea on Amazon with AI. Fast, accurate, and stress-free.";
    if (desc) desc.setAttribute("content", metaDesc);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", metaDesc);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", metaDesc);
    const title = language === "it"
      ? "Kado AI • Il Regalo Perfetto in 3 Tap"
      : "Kado AI • The Perfect Gift in 3 Taps";
    document.title = title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", title);
  }, [language]);

  // Quiz State
  const [quizState, setQuizState] = useState<QuizState>(() => savedSession?.quizState || {
    recipient: "Partner",
    vibe: "Tech",
    budget: "25-50€",
    formatPill: "Tutto",
    hasAlreadyEverything: false,
    extraDetails: "",
  });

  // Results State
  const [gifts, setGifts] = useState<GiftItem[]>(() => savedSession?.gifts || []);
  const [shownTitles, setShownTitles] = useState<string[]>(() => savedSession?.shownTitles || []);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(() => savedSession?.activeCardIndex || 0);

  // Save session state to localStorage whenever screen, quizState, gifts, or activeCardIndex change
  useEffect(() => {
    if (screen !== "loading") {
      try {
        localStorage.setItem("kado_saved_session", JSON.stringify({
          screen,
          quizState,
          gifts,
          shownTitles,
          activeCardIndex,
          timestamp: Date.now(),
        }));
      } catch (e) {
        // ignore
      }
    }
  }, [screen, quizState, gifts, shownTitles, activeCardIndex]);

  // Session Memory / Local Cache for same query parameters
  const cacheRef = useRef<Record<string, GiftItem[]>>({});
  const [loadingSubtitle, setLoadingSubtitle] = useState<string | undefined>(undefined);

  // PWA Service Worker & Deep Link Action Boot Effect
  useEffect(() => {
    registerServiceWorker();

    if (notificationsEnabled) {
      checkGlobalHolidayNotifications();
    }

    // Parse URL Action parameters from Notification click
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const action = params.get("action");
      if (action === "find_gift") {
        const recipient = params.get("recipient") || "Partner";
        const vibe = params.get("vibe") || "Tech";
        const name = params.get("name") || "";
        setQuizState((prev) => ({
          ...prev,
          recipient,
          vibe,
          extraDetails: name ? `Regalo per ${name}` : prev.extraDetails,
        }));
        setShowSplash(false);
      }
    }
  }, [notificationsEnabled]);

  // Main Gift Generator Handler (Optimistic Instant 0ms Transition)
  const handleGenerateGifts = useCallback(async (quizData: QuizState, forceRegenerate = false) => {
    // Trigger instant transition to loading screen without UI thread stall
    startTransition(() => {
      setScreen("loading");
    });
    setLoadingSubtitle(undefined);
    setQuizState(quizData);
    setActiveCardIndex(0); // Always start deck at option 1 on new search or regenerate

    const cacheKey = `${quizData.recipient}-${quizData.vibe}-${quizData.budget}-${quizData.formatPill}-${quizData.hasAlreadyEverything}-${quizData.extraDetails}-${currentCountry.code}`;

    // Session Memory Cache check (if user returns back without changing data)
    if (!forceRegenerate && cacheRef.current[cacheKey] && cacheRef.current[cacheKey].length > 0) {
      setGifts(cacheRef.current[cacheKey]);
      startTransition(() => {
        setScreen("results");
      });
      return;
    }

    const minLoadingPromise = new Promise((resolve) => setTimeout(resolve, 1500));

    let fetchedGifts: GiftItem[] = [];

    // 12-second safety timeout for API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/recommend-gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...quizData,
          excludeTitles: forceRegenerate || shownTitles.length > 0 ? shownTitles : [],
          language,
          countryCode: currentCountry.code,
          currencySymbol: currentCountry.symbol,
        }),
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.success && Array.isArray(data.gifts) && data.gifts.length > 0) {
        fetchedGifts = data.gifts.slice(0, 3);
      } else {
        fetchedGifts = generateSmartFallbackGifts(quizData, currentCountry, language);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("API timeout or network error, applying emergency fallback parachute:", err);
      fetchedGifts = generateSmartFallbackGifts(quizData, currentCountry, language);
    }

    await minLoadingPromise;

    // Cache the result
    cacheRef.current[cacheKey] = fetchedGifts;

    // Track shown titles for regenerate exclusion
    const newTitles = fetchedGifts.map((g) => g.title);
    setShownTitles((prev) => [...prev, ...newTitles]);

    setGifts(fetchedGifts);
    startTransition(() => {
      setScreen("results");
    });
  }, [currentCountry, language, shownTitles]);

  // Regenerate Button Handler ("Mostra altre 3 idee")
  const handleRegenerateGifts = useCallback(() => {
    handleGenerateGifts(quizState, true);
  }, [handleGenerateGifts, quizState]);

  // Memoized Navigation & Action Handlers
  const handleGoHome = useCallback(() => {
    try {
      localStorage.removeItem("kado_saved_session");
    } catch (e) {}
    setGifts([]);
    setActiveCardIndex(0);
    setScreen("home");
  }, []);
  const handleOpenSettings = useCallback(() => setShowSettingsDrawer(true), []);
  const handleCloseSettings = useCallback(() => setShowSettingsDrawer(false), []);
  const handleGenerateGiftsHome = useCallback(
    (data: QuizState) => {
      handleGenerateGifts(data, false);
    },
    [handleGenerateGifts]
  );
  const handleOpenLegalModal = useCallback((type: LegalDocType) => setLegalModalType(type), []);
  const handleCloseLegalModal = useCallback(() => setLegalModalType(null), []);
  const handleOpenPrivacy = useCallback(() => setLegalModalType("privacy"), []);
  const handleSendFeedback = useCallback(() => {
    if (typeof window !== "undefined") {
      window.open("mailto:support@kado.ai?subject=Feedback%20Kado%20AI", "_blank");
    }
  }, []);
  const handleHideSplash = useCallback(() => setShowSplash(false), []);
  const handleDismissOnboardingHelp = useCallback(() => {
    setShowOnboardingHelp(false);
    try {
      localStorage.setItem("kado_onboarding_seen", "1");
    } catch (e) {}
  }, []);

  return (
    <div id="app-root" className="app-container fixed inset-0 h-[var(--app-height,100dvh)] w-[100vw] overflow-hidden bg-[#FAF7F2] text-[#000000] select-none flex flex-col font-sans">
      <AnimatePresence>
        {showSplash && (
          <SplashScreenApple onComplete={handleHideSplash} />
        )}
      </AnimatePresence>

      <OnboardingHelpModal
        isOpen={!showSplash && showOnboardingHelp}
        onDismiss={handleDismissOnboardingHelp}
        language={language}
      />

      {/* Security & PWA Hardening Overlay Engine */}
      <SecurityShieldAndPwa language={language} />

      {/* Offline Apple Fallback Screen */}
      <OfflineScreenApple language={language} />

      {/* Top Navigation Bar */}
      <HeaderApple
        currentCountry={currentCountry}
        onSelectCountry={setCurrentCountry}
        language={language}
        onSelectLanguage={setLanguage}
        onOpenSettings={handleOpenSettings}
        onGoHome={handleGoHome}
      />

      {/* Main Viewport Container. paddingBottom riserva lo spazio del banner
          PWA fisso in basso, cosi il contenuto sotto non viene coperto su
          schermi bassi/stretti (es. preview a schermo laterale). */}
      <main
        className="flex-1 overflow-hidden relative flex flex-col justify-between"
        style={{ paddingBottom: "var(--pwa-banner-h, 0px)" }}
      >
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <HomeScreenApple
                language={language}
                onGenerateGifts={handleGenerateGiftsHome}
              />
            </motion.div>
          )}

          {screen === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <LoadingApple3D language={language} subtitle={loadingSubtitle} />
            </motion.div>
          )}

          {screen === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full h-full flex flex-col"
            >
              <ResultsDeckApple
                gifts={gifts}
                quizState={quizState}
                country={currentCountry}
                language={language}
                initialActiveIndex={activeCardIndex}
                onActiveIndexChange={setActiveCardIndex}
                onStartOver={handleGoHome}
                onRegenerate={handleRegenerateGifts}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={showSettingsDrawer}
        onClose={handleCloseSettings}
        language={language}
        theme={theme}
        onSelectTheme={setTheme}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={handleToggleHaptic}
        onOpenLegalModal={handleOpenLegalModal}
        onSendFeedback={handleSendFeedback}
      />

      {/* Legal & Compliance Modal */}
      {legalModalType && (
        <LegalModal
          isOpen={true}
          type={legalModalType}
          language={language}
          onClose={handleCloseLegalModal}
        />
      )}
    </div>
  );
}


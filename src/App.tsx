import React, { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HeaderApple } from "./components/HeaderApple";
import { HomeScreenApple } from "./components/HomeScreenApple";
import { LoadingApple3D } from "./components/LoadingApple3D";
import { ResultsDeckApple } from "./components/ResultsDeckApple";
import { SecurityShieldAndPwa } from "./components/SecurityShieldAndPwa";
import { OfflineScreenApple } from "./components/OfflineScreenApple";
import { SplashScreenApple } from "./components/SplashScreenApple";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { LegalModal, LegalDocType } from "./components/LegalModal";
import { CookieBanner } from "./components/CookieBanner";
import {
  ScreenType,
  QuizState,
  GiftItem,
  CountryConfig,
} from "./types";
import { detectUserCountry } from "./data/countries";
import { generateSmartFallbackGifts } from "./data/mockGifts";
import { Language } from "./data/translations";
import { registerServiceWorker } from "./lib/serviceWorker";

export default function App() {
  // Restore saved app session for background/app switch persistence
  const savedSession = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("kado_saved_session");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }, []);

  // A saved results session older than this is treated as expired rather
  // than restored. Without a cutoff, someone who used the app once and
  // comes back weeks later (never having installed it — just reopening a
  // browser tab or bookmark) lands straight back on old results with no
  // way in sight to start over feeling natural — the stale screen reads
  // as a wall blocking a fresh visit, not a convenience. 24h comfortably
  // covers "closed the tab, came back tomorrow" while still guaranteeing
  // a multi-week-old visit gets a clean start.
  const SAVED_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
  const hasRestorableSession =
    savedSession?.screen === "results" &&
    Array.isArray(savedSession?.gifts) &&
    savedSession.gifts.length > 0 &&
    typeof savedSession?.timestamp === "number" &&
    Date.now() - savedSession.timestamp < SAVED_SESSION_MAX_AGE_MS;

  // Clear out a session that exists but is past the cutoff above — it
  // was already excluded from hasRestorableSession, this just stops it
  // from lingering in storage indefinitely.
  useEffect(() => {
    if (savedSession && !hasRestorableSession) {
      try {
        localStorage.removeItem("kado_saved_session");
      } catch (e) {}
    }
  }, []);

  // The branded splash is a first-open credit, not something to sit
  // through on every reopen — a returning visitor with results already
  // saved (most relevant for someone who never installed the PWA and is
  // just reopening a browser tab/bookmark) skips straight back in.
  const [showSplash, setShowSplash] = useState(!hasRestorableSession);
  const [screen, setScreen] = useState<ScreenType>(() => {
    if (hasRestorableSession) {
      return "results";
    }
    return "home";
  });
  const [currentCountry, setCurrentCountry] = useState<CountryConfig>(detectUserCountry());

  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kado_haptic_enabled") !== "false";
    } catch (e) {
      return true;
    }
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  // Handle Haptic Toggle
  const handleToggleHaptic = useCallback((enabled: boolean) => {
    setHapticEnabled(enabled);
    try {
      localStorage.setItem("kado_haptic_enabled", enabled ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }, []);

  // Language State — detects the browser's language among the 5
  // supported ones; falls back to English (not Italian) when the
  // visitor's locale isn't one we support, consistent with
  // detectUserCountry()'s fallback to the US/English store.
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const userLang = (navigator.language || "").toLowerCase();
      const supported: Language[] = ["it", "es", "fr", "de", "en"];
      const match = supported.find((l) => userLang.startsWith(l));
      if (match) return match;
    } catch (e) {
      // fallback
    }
    return "en";
  });

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

    // Parse URL Action parameters (kept for old shared/bookmarked links)
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
  }, []);

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

  return (
    <div id="app-root" className="app-container fixed inset-0 h-[100dvh] w-[100vw] overflow-hidden bg-[#F2F2F7] text-[#000000] select-none flex flex-col font-sans gpu-layer">
      <AnimatePresence>
        {showSplash && (
          <SplashScreenApple onComplete={handleHideSplash} />
        )}
      </AnimatePresence>

      {/* Security & PWA Hardening Overlay Engine */}
      <SecurityShieldAndPwa language={language} screen={screen} />

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
              className="w-full h-full flex flex-col gpu-layer"
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
              className="w-full h-full flex flex-col gpu-layer"
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
              className="w-full h-full flex flex-col gpu-layer"
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

      {/* GDPR Cookie Consent Banner (CookieBanner gestisce il proprio stato di accettazione internamente via localStorage) */}
      <CookieBanner
        language={language}
        onOpenPrivacy={handleOpenPrivacy}
      />
    </div>
  );
}


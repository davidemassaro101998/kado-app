import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Share,
  X,
  ShieldCheck,
  Smartphone,
  PlusSquare,
  ArrowDown,
} from "lucide-react";

interface SecurityShieldAndPwaProps {
  language?: "it" | "en" | "es" | "de" | "fr";
}

export const SecurityShieldAndPwa: React.FC<SecurityShieldAndPwaProps> = ({
  language = "it",
}) => {
  // States
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showInAppBanner, setShowInAppBanner] = useState(false);

  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Su schermi bassi/stretti (es. preview a schermo laterale) questo banner
  // fisso in basso può coprire i pulsanti del wizard sottostante. Riserviamo
  // il suo spazio nel layout tramite una CSS var che i contenitori
  // scrollabili leggono come padding-bottom, invece di lasciarlo fluttuare
  // sopra contenuti non raggiungibili con lo scroll.
  const pwaBannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    if (!isStandalone && showPwaBanner && pwaBannerRef.current) {
      const h = pwaBannerRef.current.offsetHeight;
      root.style.setProperty("--pwa-banner-h", `${h + 24}px`);
    } else {
      root.style.setProperty("--pwa-banner-h", "0px");
    }
    return () => {
      root.style.setProperty("--pwa-banner-h", "0px");
    };
  }, [isStandalone, showPwaBanner]);

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "navigator" in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(12);
      } catch (e) {
        // ignore
      }
    }
  };

  // 1. Device Detection & Standalone Check
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";

    // Check Standalone Mode (If launched from Home Screen)
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    setIsStandalone(standaloneMode);

    let isDismissed = false;
    let isInstalled = false;
    try {
      isDismissed = localStorage.getItem("pwa_dismissed") === "true";
      isInstalled = localStorage.getItem("pwa_installed") === "true";
    } catch {}

    // Check In-App Browser (Instagram, TikTok, Facebook, Messenger, WeChat, etc.)
    const inAppRegex = /FBAN|FBAV|Instagram|TikTok|MicroMessenger|Line|Snapchat/i;
    const detectedInApp = inAppRegex.test(ua);
    setIsInAppBrowser(detectedInApp);
    if (detectedInApp) {
      setShowInAppBanner(true);
    }

    // Detect iOS / iPadOS
    const iosDetected =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(iosDetected);

    // 2. Intercept Native Android beforeinstallprompt & appinstalled
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      try {
        localStorage.setItem("pwa_installed", "true");
      } catch {}
      setShowPwaBanner(false);
      setShowIosGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    /* Quando chiedere di installare. PRIMA: due secondi dopo l'apertura,
       sempre -- cioe' sopra il pannello di benvenuto, sul momento piu'
       fragile, a uno che non sa ancora cosa fa l'app. Due interruzioni
       prima del primo tocco utile.
       ORA: solo dopo che ha visto almeno un risultato. Chiedere di
       installare ha senso quando l'app ha gia' dimostrato di servire; e
       chi non arriva mai a un risultato non riceve mai la richiesta. */
    let pwaTimer: any = null;
    let haVistoRisultati = false;
    try {
      haVistoRisultati = localStorage.getItem("kado_visto_risultati") === "1";
    } catch (e) {}

    const armaBanner = () => {
      if (standaloneMode || isDismissed || isInstalled) return;
      clearTimeout(pwaTimer);
      pwaTimer = setTimeout(() => setShowPwaBanner(true), 2500);
    };
    if (haVistoRisultati) armaBanner();
    // e se il primo risultato arriva adesso, senza ricaricare la pagina
    window.addEventListener("kado:visto-risultati", armaBanner);

    // 4. Anti-Cloning & Security Hardening
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
        e.preventDefault();
        return false;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        return false;
      }
    };

    const handleBlur = () => {
      // Ignore blur if the app window still has focus (e.g. keyboard open/close, focus shift inside inputs)
      if (document.hasFocus()) return;
      if (document.visibilityState === "hidden") {
        setIsWindowBlurred(true);
      }
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsWindowBlurred(true);
      } else {
        // Immediately remove blur on returning to app without any popups or confirmations
        setIsWindowBlurred(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("kado:visto-risultati", armaBanner);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (pwaTimer) clearTimeout(pwaTimer);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Clean Dismiss Handler (Saves pwa_dismissed to localStorage and closes all modals)
  const handleDismiss = () => {
    triggerHaptic();
    try {
      localStorage.setItem("pwa_dismissed", "true");
    } catch {}
    setShowPwaBanner(false);
    setShowIosGuide(false);
  };

  // Handle Main Install Button Click
  const handleInstallClick = async () => {
    triggerHaptic();

    if (deferredPrompt) {
      // Android Native Install Prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        try {
          localStorage.setItem("pwa_installed", "true");
        } catch {}
        setShowPwaBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      // iOS Guided Flow Overlay
      setShowIosGuide(true);
    } else {
      // General Fallback
      alert(
        language === "it"
          ? "Per installare l'app, usa il menu del tuo browser e seleziona 'Aggiungi a Schermata Home'."
          : "To install the app, open your browser menu and select 'Add to Home Screen'."
      );
    }
  };

  return (
    <>
      {/* Privacy Blur Overlay when App is sent to system background */}
      {isWindowBlurred && (
        <div className="fixed inset-0 z-[9999] bg-[#000000]/60 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white text-center pointer-events-none select-none transition-opacity duration-150">
          <ShieldCheck className="w-10 h-10 text-[#F14B81] mb-2 animate-pulse" />
          <h3 className="text-base font-extrabold tracking-tight">Kado AI</h3>
        </div>
      )}

      {/* 1. In-App Browser Top Banner (Instagram/TikTok/Facebook) */}
      <AnimatePresence>
        {isInAppBrowser && showInAppBanner && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-[#000000] text-white px-3 py-2 border-b border-[#2B2130]/20 flex items-center justify-between shadow-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#F14B81] shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">
                {language === "it"
                  ? "Per la migliore esperienza, apri in Safari o Chrome"
                  : "For the best experience, open in Safari or Chrome"}
              </span>
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                setShowInAppBanner(false);
              }}
              aria-label={language === "it" ? "Chiudi" : "Close"}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. INTRO SMART INSTALL BANNER (Apple Minimalist Glassmorphism - 2 sec delay) */}
      <AnimatePresence>
        {!isStandalone && showPwaBanner && (
          <motion.div
            ref={pwaBannerRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-[90] bg-[#17111A]/95 backdrop-blur-2xl text-[#F7F0F2] p-4 rounded-[20px] border border-[#2B2130] shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex flex-col gap-3 font-sans select-none"
          >
            {/* Header with Title, Subtitle, Close X */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src="/apple-touch-icon.png"
                  alt="Kado AI Icon"
                  className="w-10 h-10 rounded-2xl object-cover border border-[#2B2130] shadow-2xs shrink-0"
                />
                <div>
                  <h4 className="font-black text-sm text-[#F7F0F2] tracking-tight leading-tight">
                    {language === "it" ? "Installa l'App in 1 Tap" : "Install App in 1 Tap"}
                  </h4>
                  <p className="text-[11px] text-[#9B8A93] font-medium leading-normal mt-0.5">
                    {language === "it"
                      ? "Accedi all'istante dalla tua Schermata Home senza scaricare dagli store."
                      : "Instant 1-tap access from your Home Screen without app stores."}
                  </p>
                </div>
              </div>

              {/* Minimal Dismiss "X" Button */}
              <button
                onClick={handleDismiss}
                className="tocco-44 relative p-1.5 rounded-full hover:bg-[#1C1520] text-[#9B8A93] hover:text-[#F7F0F2] transition-colors cursor-pointer shrink-0"
                title="Chiudi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3D Tactile Solid Black Button */}
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-[18px] surface-coral-tactile hover:brightness-105 active:scale-[0.97] text-[#0E0910] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all uppercase tracking-wide border border-transparent"
            >
              <Download className="w-4 h-4 text-[#0E0910]" />
              <span>
                {deferredPrompt
                  ? language === "it"
                    ? "INSTALLA SUBITO IN HOME"
                    : "INSTALL NOW ON HOME"
                  : language === "it"
                  ? "AGGIUNGI A SCHERMATA HOME"
                  : "ADD TO HOME SCREEN"}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. iOS GUIDED MINI-OVERLAY (ANIMATED SAFARI GUIDE) */}
      <AnimatePresence>
        {showIosGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col justify-end p-4"
          >
            <motion.div
              initial={{ y: 120, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 120, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-md mx-auto bg-[#17111A]/95 backdrop-blur-2xl rounded-[28px] border border-[#2B2130] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col gap-4 text-[#F7F0F2] relative"
            >
              <div className="flex items-center justify-between border-b border-[#2B2130] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-[#F14B81] text-[#0E0910] shadow-2xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#F7F0F2]">
                    {language === "it" ? "Aggiungi a Home Screen iOS" : "Add to iOS Home Screen"}
                  </h3>
                </div>
                <button
                  onClick={handleDismiss}
                  className="tocco-44 relative p-1.5 rounded-full hover:bg-[#1C1520] text-[#9B8A93] hover:text-[#F7F0F2] transition-colors cursor-pointer"
                  title="Chiudi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step 1 & Step 2 Visual Instructions */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#1C1520] border border-[#2B2130] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F14B81] text-[#0E0910] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    1
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-extrabold text-[#F7F0F2]">
                      {language === "it" ? "Tocca il tasto 'Condividi'" : "Tap the 'Share' button"}
                    </span>
                    <p className="text-[11px] text-[#9B8A93] font-medium mt-0.5">
                      {language === "it"
                        ? "Si trova nella barra in basso di Safari"
                        : "Located in Safari bottom bar"}
                    </p>
                  </div>
                  <Share className="w-5 h-5 text-[#F14B81] shrink-0" />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1C1520] border border-[#2B2130] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#000000] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    2
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="font-extrabold text-[#F7F0F2]">
                      {language === "it" ? "Seleziona 'Aggiungi alla schermata Home'" : "Select 'Add to Home Screen'"}
                    </span>
                    <p className="text-[11px] text-[#9B8A93] font-medium mt-0.5">
                      {language === "it"
                        ? "Scorri le opzioni del menu di condivisione"
                        : "Scroll through options in the share sheet"}
                    </p>
                  </div>
                  <PlusSquare className="w-5 h-5 text-[#F7F0F2] shrink-0" />
                </div>
              </div>

              {/* Dynamic Animated Pointer Arrow */}
              <div className="flex flex-col items-center justify-center pt-1 animate-bounce text-[#F14B81]">
                <ArrowDown className="w-6 h-6 stroke-[3]" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F14B81] mt-0.5">
                  {language === "it" ? "Premi Condividi Qui Sotto" : "Press Share Below"}
                </span>
              </div>

              {/* Dismiss Guide Button */}
              <button
                onClick={handleDismiss}
                className="w-full py-3.5 rounded-[20px] surface-coral-tactile hover:brightness-105 active:scale-[0.97] text-[#0E0910] font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all border border-transparent"
              >
                {language === "it" ? "HO CAPITO" : "GOT IT"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bug corretto: qui viveva un SECONDO banner cookie indipendente
          (chiave "ideeregalo_cookie_consent", residuo di un altro
          progetto/prototipo mai ripulito) che si sovrapponeva a quello
          vero in CookieBanner.tsx (chiave "kado_cookie_accepted") —
          due banner, due modali privacy con testi diversi, stato non
          sincronizzato. Il consenso cookie ha un solo proprietario:
          App.tsx + CookieBanner.tsx. Rimosso qui. */}
    </>
  );
};

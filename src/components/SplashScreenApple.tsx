import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GiftBadge3D } from "./GiftBadge3D";

interface SplashScreenAppleProps {
  onComplete: () => void;
}

export const SplashScreenApple: React.FC<SplashScreenAppleProps> = ({ onComplete }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showDgmMark, setShowDgmMark] = useState(true);

  useEffect(() => {
    // Brief "presented by" beat before the app's own splash takes over —
    // same principle as a studio logo before a film. Kept short on
    // purpose: it's a family credit, not a second splash screen. The
    // handoff itself is sequenced by AnimatePresence (mode="wait") below,
    // not by hand-tuned delays here — an earlier version raced a fixed
    // delay against this timer and the two logos briefly overlapped,
    // reading as a rendering glitch instead of an intentional crossfade.
    const dgmTimer = setTimeout(() => {
      setShowDgmMark(false);
    }, 750);

    // Show mini spinner ~0.2s after the Kado logo has fully taken over
    // (DGM exit ~250ms + Kado's own 800ms entrance ≈ 1800ms).
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 1800);

    // Total duration -> transition to Step 1.
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(dgmTimer);
      clearTimeout(spinnerTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col items-center justify-between py-12 px-6 select-none font-sans gpu-layer"
    >
      <div className="flex-1" />

      {/* mode="wait": guarantees the DGM mark's exit animation fully
          finishes before the Kado logo starts mounting/entering — never
          both on screen at once. The earlier version animated both
          independently with hand-tuned delays and they briefly overlapped
          mid-transition, which read as a rendering glitch, not a
          deliberate crossfade. */}
      <AnimatePresence mode="wait">
        {showDgmMark ? (
          <motion.div
            key="dgm-mark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <svg width="44" height="44" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dgmRingA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="dgmRingB" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="24" r="12" fill="none" stroke="url(#dgmRingA)" strokeWidth="2.75" />
              <circle cx="30" cy="24" r="12" fill="none" stroke="url(#dgmRingB)" strokeWidth="2.75" />
            </svg>
            <p className="text-[10px] font-semibold text-[#68686D] tracking-[0.2em] uppercase">
              Presented by DGM Apps
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="kado-logo"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center p-3">
              <GiftBadge3D size="lg" />
            </div>

            <div className="space-y-1">
              <h1
                className="text-4xl tracking-tight text-[#000000]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Kado <span style={{ color: "var(--brand-coral)" }}>AI</span>
              </h1>
              <p className="text-xs font-semibold text-[#68686D] tracking-wide uppercase">
                Smart Gift Curator
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-end pb-10">
        {/* Cinematic Glowing Ring Spinner */}
        {showSpinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex items-center justify-center w-10 h-10"
          >
            {/* Soft pulsing outer glow halo */}
            <div className="absolute inset-0 rounded-full blur-md animate-pulse" style={{ backgroundColor: "color-mix(in srgb, var(--brand-coral) 20%, transparent)" }} />

            {/* Cinematic spinning gradient ring */}
            <div className="w-7 h-7 rounded-full border-[2.5px] border-[#E5E5EA] animate-spin" style={{ borderTopColor: "var(--brand-coral)", borderRightColor: "color-mix(in srgb, var(--brand-coral) 60%, transparent)" }} />

            {/* Core dot */}
            <div className="absolute w-2 h-2 rounded-full shadow-xs" style={{ backgroundColor: "var(--brand-coral)" }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

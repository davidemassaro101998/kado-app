import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Ribbon3D } from "./Ribbon3D";

interface SplashScreenAppleProps {
  onComplete: () => void;
}

export const SplashScreenApple: React.FC<SplashScreenAppleProps> = ({ onComplete }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Show mini spinner after 0.2s for 0.5s+ duration
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    // 2.5s Total Duration -> transition to Step 1
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      // Starts fully opaque (not faded in from 0) -- the header/home screen
      // underneath mount and paint immediately on first render, so a fade-in
      // here left a brief window where they were visible through the
      // still-transparent splash before it caught up to full opacity.
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#F2F2F7] flex flex-col items-center justify-between py-12 px-6 select-none font-sans gpu-layer"
    >
      <div className="flex-1" />

      {/* Center Logo with Fade-In Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <div className="w-20 h-20 rounded-[28px] bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center p-3">
          <Ribbon3D size="lg" />
        </div>

        <div className="space-y-1">
          <h1
            className="text-4xl tracking-tight text-[#000000]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Kado <span style={{ color: "var(--brand-coral)" }}>AI</span>
          </h1>
          <p className="text-xs font-semibold text-[#8E8E93] tracking-wide uppercase">
            Smart Gift Curator
          </p>
        </div>
      </motion.div>

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

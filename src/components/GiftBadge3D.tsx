import React from "react";
import { motion } from "motion/react";

interface GiftBadge3DProps {
  size?: "sm" | "md" | "lg" | "xl";
  animateFloating?: boolean;
}

// Badge di marchio: scatola regalo su sfondo corallo (--brand-coral),
// stessa identica struttura di ToolBadge3D (Bricolo) e FitBadge3D (Forma)
// — rounded-square con gradiente del colore di marchio + glifo bianco a
// tratto semplice. Sostituisce Ribbon3D, che era rimasto nello stile
// realistico/3D-shaded originale (blu navy + oro, ombre e gradienti
// multipli) mentre le altre due app della famiglia erano già passate a
// questo badge piatto: la stessa app "sembrava diversa nello stile"
// dalle sorelle proprio per questo disallineamento.
export const GiftBadge3D: React.FC<GiftBadge3DProps> = ({ size = "sm", animateFloating = false }) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36",
  }[size];

  const icon = (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="giftBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="100%" stopColor="#E63354" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="100" height="100" rx="26" fill="url(#giftBadgeBg)" />
      <g stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" fill="none">
        {/* Box body + lid */}
        <rect x="28" y="52" width="64" height="42" rx="6" />
        <rect x="22" y="38" width="76" height="16" rx="5" />
        {/* Vertical ribbon */}
        <line x1="60" y1="38" x2="60" y2="94" />
        {/* Bow loops */}
        <path d="M 60 38 C 48 24, 34 30, 52 38" />
        <path d="M 60 38 C 72 24, 86 30, 68 38" />
      </g>
    </svg>
  );

  if (animateFloating) {
    return (
      <div className="relative flex items-center justify-center [perspective:1000px]">
        <motion.div
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 w-28 h-5 bg-black/15 rounded-full blur-lg"
        />
        <motion.div
          animate={{ rotateY: [0, 180, 360], y: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={`${dimensions} relative flex items-center justify-center [transform-style:preserve-3d] filter drop-shadow-[0_12px_24px_rgba(28,53,78,0.3)]`}
        >
          {icon}
        </motion.div>
      </div>
    );
  }

  return <div className={`${dimensions} flex items-center justify-center shrink-0`}>{icon}</div>;
};

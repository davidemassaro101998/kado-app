import React from "react";
import { motion } from "motion/react";

interface Ribbon3DProps {
  size?: "sm" | "md" | "lg" | "xl";
  animateFloating?: boolean;
  /** Overrides the fixed size classes for `size` -- for embedding inside a
   *  container that's already fluidly sized (e.g. a clamp()-based wrapper)
   *  where a fixed pixel size would overflow on short viewports. */
  className?: string;
}

export const Ribbon3D: React.FC<Ribbon3DProps> = ({ size = "sm", animateFloating = false, className }) => {
  const dimensions = className ?? {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36",
  }[size];

  if (animateFloating) {
    return (
      <div className="relative flex items-center justify-center [perspective:1000px]">
        {/* Soft Physical Ambient Shadow under floating 3D Present */}
        <motion.div
          animate={{
            scale: [0.85, 1.1, 0.85],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-6 w-28 h-5 bg-black/15 rounded-full blur-lg"
        />

        <motion.div
          animate={{
            rotateX: [0, 12, -8, 0],
            rotateY: [0, 180, 360],
            rotateZ: [0, 5, -5, 0],
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`${dimensions} relative flex items-center justify-center [transform-style:preserve-3d] filter drop-shadow-[0_12px_24px_rgba(28,53,78,0.3)]`}
        >
          {/* 3D Present Gift Box Icon */}
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Box Top Gradient */}
              <linearGradient id="boxLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8FA3" />
                <stop offset="50%" stopColor="#FF2E7E" />
                <stop offset="100%" stopColor="#E01E68" />
              </linearGradient>

              {/* Box Base Gradient */}
              <linearGradient id="boxBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E01E68" />
                <stop offset="100%" stopColor="#8A1038" />
              </linearGradient>

              {/* Polished Gold Ribbon Gradient */}
              <linearGradient id="goldRibbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B38A36" />
                <stop offset="30%" stopColor="#F5E4A8" />
                <stop offset="70%" stopColor="#DFB960" />
                <stop offset="100%" stopColor="#9C7528" />
              </linearGradient>

              {/* Gold Specular Highlight */}
              <linearGradient id="goldHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFF2D1" stopOpacity="0.2" />
              </linearGradient>

              <filter id="presentShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Main 3D Gift Box Body */}
            <rect
              x="25"
              y="48"
              width="70"
              height="52"
              rx="12"
              fill="url(#boxBaseGrad)"
              stroke="#8A1038"
              strokeWidth="2"
            />

            {/* Vertical Gold Ribbon Wrap */}
            <rect x="52" y="48" width="16" height="52" fill="url(#goldRibbonGrad)" />

            {/* Box Lid Overhang */}
            <rect
              x="20"
              y="36"
              width="80"
              height="18"
              rx="8"
              fill="url(#boxLidGrad)"
              stroke="#DFB960"
              strokeWidth="1.5"
              filter="url(#presentShadow)"
            />

            {/* Lid Vertical Gold Ribbon */}
            <rect x="52" y="36" width="16" height="18" fill="url(#goldRibbonGrad)" />

            {/* Horizontal Gold Ribbon on Lid */}
            <rect x="20" y="42" width="80" height="6" fill="url(#goldRibbonGrad)" />

            {/* 3D Tied Gift Bow - Left Loop */}
            <path
              d="M 60 36 C 42 16, 22 28, 56 36 Z"
              fill="url(#goldRibbonGrad)"
              stroke="#B38A36"
              strokeWidth="1.5"
            />

            {/* 3D Tied Gift Bow - Right Loop */}
            <path
              d="M 60 36 C 78 16, 98 28, 64 36 Z"
              fill="url(#goldRibbonGrad)"
              stroke="#B38A36"
              strokeWidth="1.5"
            />

            {/* Center Bow Knot Jewel */}
            <circle cx="60" cy="36" r="6" fill="url(#goldHighlightGrad)" stroke="#DFB960" strokeWidth="2" />
            <circle cx="60" cy="36" r="3" fill="#FFFFFF" />

            {/* Sparkling Ribbon Tails */}
            <path d="M 55 38 L 42 54 L 48 55 L 58 39 Z" fill="url(#goldRibbonGrad)" opacity="0.9" />
            <path d="M 65 38 L 78 54 L 72 55 L 62 39 Z" fill="url(#goldRibbonGrad)" opacity="0.9" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // Static / Compact Logo
  return (
    <div className={`${dimensions} flex items-center justify-center shrink-0`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="lidGradSm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2E7E" />
            <stop offset="100%" stopColor="#E01E68" />
          </linearGradient>
          <linearGradient id="goldGradSm" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B38A36" />
            <stop offset="50%" stopColor="#FFF2D1" />
            <stop offset="100%" stopColor="#DFB960" />
          </linearGradient>
        </defs>

        {/* Box Body */}
        <rect x="25" y="48" width="70" height="52" rx="12" fill="url(#lidGradSm)" stroke="#DFB960" strokeWidth="2" />
        
        {/* Vertical Gold Ribbon */}
        <rect x="52" y="48" width="16" height="52" fill="url(#goldGradSm)" />

        {/* Lid */}
        <rect x="20" y="36" width="80" height="18" rx="8" fill="url(#lidGradSm)" stroke="#DFB960" strokeWidth="2" />
        <rect x="52" y="36" width="16" height="18" fill="url(#goldGradSm)" />

        {/* Tied Bow Loops */}
        <path d="M 60 36 C 42 16, 22 28, 56 36 Z" fill="url(#goldGradSm)" />
        <path d="M 60 36 C 78 16, 98 28, 64 36 Z" fill="url(#goldGradSm)" />

        {/* Knot */}
        <circle cx="60" cy="36" r="5" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

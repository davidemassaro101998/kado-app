import { useState, useEffect } from "react";

export interface ViewportMetrics {
  width: number;
  height: number;
  isLandscape: boolean;
  isCompactHeight: boolean;
  isSmallScreen: boolean;
  scaleFactor: number;
}

export function useResponsiveViewport(): ViewportMetrics {
  const [metrics, setMetrics] = useState<ViewportMetrics>(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 390;
    const h = typeof window !== "undefined" ? window.innerHeight : 844;
    return calculateMetrics(w, h);
  });

  function calculateMetrics(w: number, h: number): ViewportMetrics {
    const isLandscape = w > h;
    const isCompactHeight = h < 520 || (isLandscape && h < 600);
    const minDim = Math.min(w, h);
    const isSmallScreen = minDim < 375;
    // Base scale factor relative to standard phone width 390
    const scaleFactor = Math.max(0.85, Math.min(1.2, minDim / 390));

    return {
      width: w,
      height: h,
      isLandscape,
      isCompactHeight,
      isSmallScreen,
      scaleFactor,
    };
  }

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMetrics(calculateMetrics(w, h));
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return metrics;
}

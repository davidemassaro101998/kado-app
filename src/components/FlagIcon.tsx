import React from "react";

interface FlagIconProps {
  code: string; // "IT", "EN", "GB", "US", "DE", "FR", "ES"
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = "w-5 h-3.5" }) => {
  const upper = code.toUpperCase();

  switch (upper) {
    case "IT":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="10" height="20" x="0" fill="#009246" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#CE2B37" />
        </svg>
      );

    case "EN":
    case "GB":
    case "UK":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
          <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.5" />
        </svg>
      );

    case "US":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="30" height="20" fill="#B22234" />
          <path d="M0,2.85 H30 M0,5.7 H30 M0,8.55 H30 M0,11.4 H30 M0,14.25 H30 M0,17.1 H30" stroke="#FFFFFF" strokeWidth="1.42" />
          <rect width="12" height="11.4" fill="#3C3B6E" />
          <circle cx="3" cy="2.8" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="2.8" r="0.8" fill="#FFFFFF" />
          <circle cx="6" cy="5.7" r="0.8" fill="#FFFFFF" />
          <circle cx="3" cy="8.5" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="8.5" r="0.8" fill="#FFFFFF" />
        </svg>
      );

    case "DE":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="30" height="6.67" x="0" y="0" fill="#000000" />
          <rect width="30" height="6.67" x="0" y="6.67" fill="#DD0000" />
          <rect width="30" height="6.67" x="0" y="13.33" fill="#FFCE00" />
        </svg>
      );

    case "FR":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="10" height="20" x="0" fill="#002395" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#ED2939" />
        </svg>
      );

    case "ES":
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="30" height="5" x="0" y="0" fill="#AA151B" />
          <rect width="30" height="10" x="0" y="5" fill="#F1BF00" />
          <rect width="30" height="5" x="0" y="15" fill="#AA151B" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
          <rect width="10" height="20" x="0" fill="#009246" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#CE2B37" />
        </svg>
      );
  }
};

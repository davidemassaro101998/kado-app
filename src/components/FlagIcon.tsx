import React from "react";

interface FlagIconProps {
  code: string; // ISO-ish market code used in CountryConfig, e.g. "IT", "US", "GB"
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = "w-5 h-3.5" }) => {
  const upper = code.toUpperCase();
  const wrap = (children: React.ReactNode) => (
    <svg viewBox="0 0 30 20" className={`rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block ${className}`}>
      {children}
    </svg>
  );

  switch (upper) {
    case "IT":
      return wrap(
        <>
          <rect width="10" height="20" x="0" fill="#009246" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#CE2B37" />
        </>
      );

    case "EN":
    case "GB":
    case "UK":
      return wrap(
        <>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
          <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.5" />
        </>
      );

    case "US":
      return wrap(
        <>
          <rect width="30" height="20" fill="#B22234" />
          <path d="M0,2.85 H30 M0,5.7 H30 M0,8.55 H30 M0,11.4 H30 M0,14.25 H30 M0,17.1 H30" stroke="#FFFFFF" strokeWidth="1.42" />
          <rect width="12" height="11.4" fill="#3C3B6E" />
          <circle cx="3" cy="2.8" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="2.8" r="0.8" fill="#FFFFFF" />
          <circle cx="6" cy="5.7" r="0.8" fill="#FFFFFF" />
          <circle cx="3" cy="8.5" r="0.8" fill="#FFFFFF" />
          <circle cx="9" cy="8.5" r="0.8" fill="#FFFFFF" />
        </>
      );

    case "DE":
      return wrap(
        <>
          <rect width="30" height="6.67" x="0" y="0" fill="#000000" />
          <rect width="30" height="6.67" x="0" y="6.67" fill="#DD0000" />
          <rect width="30" height="6.67" x="0" y="13.33" fill="#FFCE00" />
        </>
      );

    case "FR":
      return wrap(
        <>
          <rect width="10" height="20" x="0" fill="#002395" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#ED2939" />
        </>
      );

    case "ES":
      return wrap(
        <>
          <rect width="30" height="5" x="0" y="0" fill="#AA151B" />
          <rect width="30" height="10" x="0" y="5" fill="#F1BF00" />
          <rect width="30" height="5" x="0" y="15" fill="#AA151B" />
        </>
      );

    case "CA":
      return wrap(
        <>
          <rect width="30" height="20" fill="#FFFFFF" />
          <rect width="7.5" height="20" x="0" fill="#FF0000" />
          <rect width="7.5" height="20" x="22.5" fill="#FF0000" />
          <path d="M15,4 L16.5,8 L20,7 L18,10.5 L21,12 L17.5,13 L18,17 L15,14.5 L12,17 L12.5,13 L9,12 L12,10.5 L10,7 L13.5,8 Z" fill="#FF0000" />
        </>
      );

    case "JP":
      return wrap(
        <>
          <rect width="30" height="20" fill="#FFFFFF" />
          <circle cx="15" cy="10" r="6" fill="#BC002D" />
        </>
      );

    case "AU":
      return wrap(
        <>
          <rect width="30" height="20" fill="#00008B" />
          <rect width="15" height="10" x="0" y="0" fill="#00008B" />
          <path d="M0,0 L15,10 M15,0 L0,10" stroke="#FFFFFF" strokeWidth="1.6" />
          <path d="M0,0 L15,10 M15,0 L0,10" stroke="#FF0000" strokeWidth="0.8" />
          <path d="M7.5,0 V10 M0,5 H15" stroke="#FFFFFF" strokeWidth="2.4" />
          <path d="M7.5,0 V10 M0,5 H15" stroke="#FF0000" strokeWidth="1.2" />
          <circle cx="22" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="25" cy="9" r="1" fill="#FFFFFF" />
          <circle cx="21" cy="13" r="1" fill="#FFFFFF" />
          <circle cx="25.5" cy="15" r="1" fill="#FFFFFF" />
          <circle cx="27.5" cy="12" r="0.7" fill="#FFFFFF" />
        </>
      );

    case "NL":
      return wrap(
        <>
          <rect width="30" height="6.67" x="0" y="0" fill="#AE1C28" />
          <rect width="30" height="6.67" x="0" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" x="0" y="13.33" fill="#21468B" />
        </>
      );

    case "MX":
      return wrap(
        <>
          <rect width="10" height="20" x="0" fill="#006847" />
          <rect width="10" height="20" x="10" fill="#FFFFFF" />
          <rect width="10" height="20" x="20" fill="#CE1126" />
          <circle cx="15" cy="10" r="2.5" fill="#8B5A2B" />
        </>
      );

    case "BR":
      return wrap(
        <>
          <rect width="30" height="20" fill="#009739" />
          <path d="M15,3 L27,10 L15,17 L3,10 Z" fill="#FEDD00" />
          <circle cx="15" cy="10" r="4" fill="#012169" />
        </>
      );

    case "IN":
      return wrap(
        <>
          <rect width="30" height="6.67" x="0" y="0" fill="#FF9933" />
          <rect width="30" height="6.67" x="0" y="6.67" fill="#FFFFFF" />
          <rect width="30" height="6.67" x="0" y="13.33" fill="#138808" />
          <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.4" />
        </>
      );

    case "SE":
      return wrap(
        <>
          <rect width="30" height="20" fill="#006AA7" />
          <rect width="4" height="20" x="10" fill="#FECC00" />
          <rect width="30" height="4" y="8" fill="#FECC00" />
        </>
      );

    case "PL":
      return wrap(
        <>
          <rect width="30" height="10" x="0" y="0" fill="#FFFFFF" />
          <rect width="30" height="10" x="0" y="10" fill="#DC143C" />
        </>
      );

    case "BE":
      return wrap(
        <>
          <rect width="10" height="20" x="0" fill="#000000" />
          <rect width="10" height="20" x="10" fill="#FAE042" />
          <rect width="10" height="20" x="20" fill="#ED2939" />
        </>
      );

    case "SG":
      return wrap(
        <>
          <rect width="30" height="10" x="0" y="0" fill="#ED2939" />
          <rect width="30" height="10" x="0" y="10" fill="#FFFFFF" />
          <circle cx="8" cy="5" r="3.2" fill="#FFFFFF" />
          <circle cx="9.4" cy="5" r="2.7" fill="#ED2939" />
        </>
      );

    case "AE":
      return wrap(
        <>
          <rect width="4.5" height="20" x="0" fill="#FF0000" />
          <rect width="25.5" height="6.67" x="4.5" y="0" fill="#00732F" />
          <rect width="25.5" height="6.67" x="4.5" y="6.67" fill="#FFFFFF" />
          <rect width="25.5" height="6.67" x="4.5" y="13.33" fill="#000000" />
        </>
      );

    default:
      return wrap(
        <>
          <rect width="30" height="20" fill="#8E8E93" />
          <circle cx="15" cy="10" r="6" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        </>
      );
  }
};

// Rete di sicurezza contro il crash totale. Senza questo, un errore
// JavaScript non gestito in QUALSIASI componente (un campo mancante
// nella risposta di Gemini, un localStorage corrotto, un dato
// inatteso) fa sparire l'intera app dietro una schermata bianca —
// l'esperienza peggiore possibile quando l'app scala e i casi limite
// che non hai potuto testare a mano cominciano a presentarsi davvero.
//
// Non e un cerotto: intercetta, mostra un recupero elegante coerente
// col resto dell'app, e offre un modo di ripartire pulito (svuota lo
// stato locale sospetto e ricarica) invece di lasciare l'utente
// bloccato su una pagina bianca senza spiegazioni.

import React from "react";
import { Language, TRANSLATIONS } from "../data/translations";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; language?: Language },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; language?: Language }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Kado AI — errore intercettato dall'ErrorBoundary:", error, info);
  }

  handleReset = () => {
    // Pulisce solo lo stato di sessione/form che potrebbe essere la
    // causa (dato corrotto salvato in precedenza) — non tocca le
    // occasioni salvate ne le preferenze dell'utente.
    try {
      localStorage.removeItem("kado_saved_session");
      localStorage.removeItem("kado_home_form_state");
    } catch (e) {
      // ignore
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const t = TRANSLATIONS[this.props.language || "it"] || TRANSLATIONS.en;
      return (
        <div className="fixed inset-0 z-[999] bg-[#F2F2F7] flex flex-col items-center justify-center gap-4 px-8 text-center font-sans">
          <div className="w-16 h-16 rounded-[24px] bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center text-3xl">
            🎁
          </div>
          <h2
            className="text-xl text-[#000000]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {t.errorTitle}
          </h2>
          <p className="text-sm text-[#8E8E93] max-w-xs">
            {t.errorText}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-2 py-3 px-6 rounded-[18px] text-white font-bold text-sm cursor-pointer active:scale-[0.97] transition-all"
            style={{ backgroundColor: "var(--brand-coral)" }}
          >
            {t.errorRestartBtn}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

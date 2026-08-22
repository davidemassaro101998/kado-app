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
import { reportError } from "../lib/monitoring";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; language?: "it" | "en" },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; language?: "it" | "en" }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportError(error, { componentStack: info.componentStack, app: "Kado AI" });
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
      const isIt = (this.props.language || "it") === "it";
      return (
        <div className="fixed inset-0 z-[999] bg-[#F2F2F7] flex flex-col items-center justify-center gap-4 px-8 text-center font-sans">
          <div className="w-16 h-16 rounded-[24px] bg-white border border-[#E5E5EA] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center text-3xl">
            🎁
          </div>
          <h2
            className="text-xl text-[#000000]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {isIt ? "Qualcosa è andato storto" : "Something went wrong"}
          </h2>
          <p className="text-sm text-[#8E8E93] max-w-xs">
            {isIt
              ? "Nessun problema — le tue occasioni salvate sono al sicuro. Riprova a ripartire."
              : "No worries — your saved occasions are safe. Let's start fresh."}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-2 py-3 px-6 rounded-[18px] text-white font-bold text-sm cursor-pointer active:scale-[0.97] transition-all"
            style={{ backgroundColor: "var(--brand-coral)" }}
          >
            {isIt ? "Ricomincia" : "Start over"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

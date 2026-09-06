import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, Sparkles, RotateCcw, Image as ImageIcon, Loader2 } from "lucide-react";
import { Language } from "../data/translations";

interface CameraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Riceve la descrizione che l'AI ha ricavato dalla foto, nella stessa
   *  forma del testo dettato a voce: da qui in poi il flusso e' identico. */
  onSubmitIdea: (idea: string) => void;
  language?: Language;
}

const COPY = {
  it: {
    title: "Inquadra e trova",
    close: "Chiudi",
    hint: "Inquadra la persona, la sua stanza o una cosa che le piace",
    shoot: "Scatta",
    retake: "Rifai",
    gallery: "Dalla galleria",
    analyze: "ANALIZZA E TROVA",
    analyzing: "Sto guardando la foto...",
    errCamera: "Non riesco ad aprire la fotocamera. Usa la galleria qui sotto.",
    errAnalyze: "Non sono riuscito a leggere la foto. Riprova, o scegline un'altra.",
  },
  en: {
    title: "Point and find",
    close: "Close",
    hint: "Point at the person, their room, or something they love",
    shoot: "Shoot",
    retake: "Retake",
    gallery: "From gallery",
    analyze: "ANALYSE AND FIND",
    analyzing: "Looking at the photo...",
    errCamera: "Can't open the camera. Use the gallery below.",
    errAnalyze: "I couldn't read the photo. Try again, or pick another.",
  },
} as const;

/* Le foto di un telefono moderno pesano diversi megabyte. Spedirle
   com'e' significa attese lunghe in rete e un costo per chiamata piu'
   alto senza guadagnare un grammo di precisione: il lato lungo a 1024px
   e' abbondante perche' il modello riconosca una scena. */
const MAX_EDGE = 1024;
const JPEG_QUALITY = 0.82;

function downscaleToDataUrl(source: HTMLVideoElement | HTMLImageElement, w: number, h: number): string {
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export const CameraDrawer = React.memo(({ isOpen, onClose, onSubmitIdea, language = "it" }: CameraDrawerProps) => {
  const t = COPY[language] ?? COPY.it;
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStreamReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // La camera posteriore e' quella giusta per inquadrare una cosa
        // o una stanza; "ideal" e non "exact" cosi un portatile con una
        // sola webcam frontale funziona lo stesso invece di fallire.
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStreamReady(true);
      setErrorMsg(null);
    } catch {
      // Niente permesso, niente fotocamera, o contesto non sicuro: resta
      // la galleria, che sui telefoni apre comunque l'app fotocamera.
      setStreamReady(false);
      setErrorMsg(t.errCamera);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen && !photo) void startCamera();
    if (!isOpen) {
      stopCamera();
      setPhoto(null);
      setErrorMsg(null);
      setIsAnalyzing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, photo]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Esc chiude: su desktop e' il gesto atteso da un pannello modale, e
  // senza di esso l'unica via d'uscita era centrare la X.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const dataUrl = downscaleToDataUrl(video, video.videoWidth, video.videoHeight);
    if (!dataUrl) return;
    setPhoto(dataUrl);
    stopCamera();
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const dataUrl = downscaleToDataUrl(img, img.naturalWidth, img.naturalHeight);
        if (dataUrl) {
          setPhoto(dataUrl);
          stopCamera();
          setErrorMsg(null);
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    // Permette di riselezionare lo stesso file una seconda volta.
    e.target.value = "";
  };

  const analyze = async () => {
    if (!photo) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ image: photo, language }),
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (data?.success && typeof data.description === "string" && data.description.trim()) {
        onClose();
        onSubmitIdea(data.description.trim());
        return;
      }
      setErrorMsg(t.errAnalyze);
    } catch {
      clearTimeout(timeoutId);
      setErrorMsg(t.errAnalyze);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-[9991] mx-auto flex max-w-lg select-none flex-col items-center gap-4 rounded-t-[32px] border-t border-[#2B2130] bg-[#17111A]/95 p-6 pb-[max(24px,env(safe-area-inset-bottom,0px))] font-sans shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-lg gpu-layer"
          >
            <div className="-mt-1 h-1.5 w-12 shrink-0 rounded-full bg-[#2B2130]" />

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-[#F14B81]">
                <Sparkles className="h-4 w-4 fill-[#F14B81]" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.title}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="tocco-44 relative cursor-pointer rounded-full bg-[#1C1520] p-1.5 text-[#9B8A93] transition-colors hover:text-[#F7F0F2]"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Mirino / anteprima */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-[#2B2130] bg-[#0E0910]">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                  {!streamReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-9 w-9 text-[#3A2F40]" strokeWidth={1.6} />
                    </div>
                  )}
                  {/* Cornice di inquadratura: dice dove guardare senza
                      coprire l'immagine. */}
                  <div className="pointer-events-none absolute inset-5 rounded-[14px] border border-white/20" />
                </>
              )}
            </div>

            <p className="text-center text-xs font-semibold text-[#9B8A93]">{t.hint}</p>

            {errorMsg && (
              <p className="px-2 text-center text-[11px] font-medium text-[#FF8FB0]">{errorMsg}</p>
            )}

            {/* Comandi */}
            <div className="flex w-full items-center justify-center gap-3">
              {photo ? (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[#2B2130] bg-[#1C1520] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#F7F0F2] transition-colors hover:border-[#F14B81]"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2.4} />
                  {t.retake}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={capture}
                  disabled={!streamReady}
                  aria-label={t.shoot}
                  className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#F14B81] text-[#0E0910] shadow-[0_0_28px_rgba(241,75,129,0.45)] transition-transform active:scale-95 disabled:opacity-40"
                >
                  <Camera className="h-7 w-7 stroke-[2.4]" />
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[#2B2130] bg-[#1C1520] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#9B8A93] transition-colors hover:border-[#F14B81] hover:text-[#F7F0F2]"
              >
                <ImageIcon className="h-4 w-4" strokeWidth={2.4} />
                {t.gallery}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onPickFile}
                className="hidden"
              />
            </div>

            <button
              type="button"
              disabled={!photo || isAnalyzing}
              onClick={analyze}
              className="mt-1 flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[20px] border border-[#F14B81] bg-[#F14B81] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#0E0910] shadow-[0_8px_20px_rgba(241,75,129,0.3)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.6} />
                  <span>{t.analyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-current" />
                  <span>{t.analyze}</span>
                </>
              )}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Attribuzione per canale — sapere se un click viene da TikTok,
// Instagram o altro, non solo "da qualche parte sui social". Amazon
// Associates permette fino a 100 Tracking ID diversi sullo stesso
// account: qui costruiamo il suffisso, ma il Tracking ID risultante
// (es. "giftai0f-21-tiktok") va CREATO per davvero nel pannello
// Amazon Associates prima del lancio — altrimenti Amazon risolve
// comunque il link (nessun errore per l'utente) ma non ti accredita
// la commissione su quel click, perche il tag non esiste.
//
// Rilevamento: un parametro esplicito `?ref=tiktok` nel link condiviso
// (quello che mettiamo in bio/negli ads) ha priorita; altrimenti si
// deduce dal referrer del browser. Il primo valore rilevato viene
// salvato una sola volta — un utente arrivato da TikTok resta
// "tiktok" anche se poi riapre l'app direttamente dalla Home.

const STORAGE_KEY = "kado_channel";
const KNOWN_CHANNELS = ["tiktok", "instagram", "facebook", "whatsapp", "direct"];

function detectChannel(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const explicit = (params.get("ref") || "").toLowerCase();
    if (KNOWN_CHANNELS.includes(explicit)) return explicit;

    const ref = (document.referrer || "").toLowerCase();
    if (ref.includes("tiktok")) return "tiktok";
    if (ref.includes("instagram")) return "instagram";
    if (ref.includes("facebook") || ref.includes("fb.com")) return "facebook";
    if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
  } catch (e) {
    // ignore
  }
  return "direct";
}

export function getChannel(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch (e) {
    // ignore
  }
  const channel = detectChannel();
  try {
    localStorage.setItem(STORAGE_KEY, channel);
  } catch (e) {
    // ignore
  }
  return channel;
}

/** Aggiunge il suffisso di canale a un Tracking ID base, es.
 * "giftai0f-21" -> "giftai0f-21-tiktok". Il canale "direct" non
 * aggiunge suffisso: resta il tag base, gia registrato. */
export function withChannelSuffix(baseTag: string): string {
  const channel = getChannel();
  if (channel === "direct") return baseTag;
  return `${baseTag}-${channel}`;
}

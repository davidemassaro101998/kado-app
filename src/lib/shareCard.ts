// Card condivisibile "Aura": genera un'immagine verticale del regalo
// trovato, disegnata per essere mandata in chat (WhatsApp, Telegram...),
// non solo guardata. Il badge del tempo in alto e la prova della
// promessa del marchio; la firma Kado in basso e il motore di crescita:
// chi riceve la card vede il brand nel momento di massima gratitudine.
//
// L'immagine e disegnata su canvas lato client. La foto prodotto viene
// caricata con crossOrigin="anonymous": se il CDN non manda gli header
// CORS il canvas risulterebbe "tainted" e inesportabile, quindi in quel
// caso si ripiega su un glifo regalo stilizzato — la card resta sempre
// generabile.

import { GiftItem } from "../types";

const W = 1080;
const H = 1620;

const BG = "#0E0910";
const MAGENTA = "#FF3D7F";
const GOLD = "#FFB24D";
const TEXT = "#F7F0F2";
const MUTED = "#B8A9B0";

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => resolve(null), 4000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ") !== lines.join(" ")) {
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = last.length > 3 ? `${last.slice(0, -1)}…` : `${last}…`;
  }
  return lines;
}

function drawGiftGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size / 24;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.strokeStyle = TEXT;
  ctx.lineWidth = 1.4 * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeRect(4 * s, 8 * s, 16 * s, 13 * s);
  ctx.beginPath();
  ctx.moveTo(12 * s, 8 * s);
  ctx.lineTo(12 * s, 21 * s);
  ctx.moveTo(4 * s, 12.5 * s);
  ctx.lineTo(20 * s, 12.5 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(8.5 * s, 5.5 * s, 3.4 * s, 2.4 * s, -0.5, 0, Math.PI * 2);
  ctx.moveTo(18.9 * s, 5.5 * s);
  ctx.ellipse(15.5 * s, 5.5 * s, 3.4 * s, 2.4 * s, 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export async function buildShareCardBlob(
  gift: GiftItem,
  foundInSeconds: number | null,
  language: string
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const isIt = language === "it";
  const seconds = foundInSeconds && foundInSeconds > 0 && foundInSeconds <= 20 ? foundInSeconds : 20;

  // Sfondo + aure agli angoli
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  let glow = ctx.createRadialGradient(60, 60, 0, 60, 60, 640);
  glow.addColorStop(0, "rgba(255,61,127,0.4)");
  glow.addColorStop(1, "rgba(255,61,127,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  glow = ctx.createRadialGradient(W - 60, H - 60, 0, W - 60, H - 60, 640);
  glow.addColorStop(0, "rgba(255,178,77,0.32)");
  glow.addColorStop(1, "rgba(255,178,77,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Badge del tempo: la prova della promessa
  const badgeText = isIt ? `TROVATO IN ${seconds} SECONDI` : `FOUND IN ${seconds} SECONDS`;
  ctx.font = "800 34px Archivo, system-ui, sans-serif";
  const badgeW = ctx.measureText(badgeText).width + 150;
  const badgeX = (W - badgeW) / 2;
  ctx.save();
  ctx.shadowColor = "rgba(255,61,127,0.5)";
  ctx.shadowBlur = 40;
  roundRect(ctx, badgeX, 90, badgeW, 84, 42);
  ctx.fillStyle = "rgba(255,61,127,0.16)";
  ctx.fill();
  ctx.restore();
  roundRect(ctx, badgeX, 90, badgeW, 84, 42);
  ctx.strokeStyle = "rgba(255,61,127,0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();
  // fulmine
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  const lx = badgeX + 52;
  const ly = 110;
  ctx.moveTo(lx + 18, ly);
  ctx.lineTo(lx, ly + 26);
  ctx.lineTo(lx + 14, ly + 26);
  ctx.lineTo(lx + 12, ly + 44);
  ctx.lineTo(lx + 30, ly + 18);
  ctx.lineTo(lx + 16, ly + 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#FFD9A8";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + 100, 134);

  // Piastra prodotto
  const plateX = 90;
  const plateY = 240;
  const plateW = W - 180;
  const plateH = 620;
  roundRect(ctx, plateX, plateY, plateW, plateH, 44);
  const plateGrad = ctx.createLinearGradient(plateX, plateY, plateX + plateW, plateY + plateH);
  plateGrad.addColorStop(0, "rgba(255,255,255,0.08)");
  plateGrad.addColorStop(1, "rgba(255,61,127,0.07)");
  ctx.fillStyle = plateGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const productImg = gift.imageUrl ? await loadImage(gift.imageUrl) : null;
  if (productImg) {
    // Foto su fondo bianco arrotondato (le foto Amazon nascono su bianco)
    ctx.save();
    roundRect(ctx, plateX + 40, plateY + 40, plateW - 80, plateH - 80, 32);
    ctx.fillStyle = "#FAFAFC";
    ctx.fill();
    ctx.clip();
    const availW = plateW - 140;
    const availH = plateH - 140;
    const scale = Math.min(availW / productImg.naturalWidth, availH / productImg.naturalHeight);
    const dw = productImg.naturalWidth * scale;
    const dh = productImg.naturalHeight * scale;
    ctx.drawImage(productImg, plateX + (plateW - dw) / 2, plateY + (plateH - dh) / 2, dw, dh);
    ctx.restore();
  } else {
    drawGiftGlyph(ctx, W / 2, plateY + plateH / 2 - 20, 320);
  }

  // Pill prezzo sopra la piastra
  if (gift.price) {
    ctx.font = "900 44px Archivo, system-ui, sans-serif";
    const priceW = ctx.measureText(gift.price).width + 90;
    const priceX = plateX + plateW - priceW - 36;
    const priceY = plateY + plateH - 110;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 30;
    roundRect(ctx, priceX, priceY, priceW, 78, 39);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = BG;
    ctx.fillText(gift.price, priceX + 45, priceY + 41);
  }

  // Titolo
  ctx.fillStyle = TEXT;
  ctx.font = "900 62px Archivo, system-ui, sans-serif";
  const titleLines = wrapText(ctx, gift.title || "", W - 200, 2);
  let ty = 960;
  for (const line of titleLines) {
    ctx.fillText(line, 100, ty);
    ty += 78;
  }

  // Rating
  const rating = gift.rating ? gift.rating.toFixed(1) : "4.8";
  ctx.fillStyle = GOLD;
  ctx.font = "700 40px Archivo, system-ui, sans-serif";
  const stars = "★★★★★";
  ctx.fillText(stars, 100, ty + 24);
  ctx.fillStyle = MUTED;
  ctx.font = "600 36px Archivo, system-ui, sans-serif";
  ctx.fillText(`${rating} · ${isIt ? "su Amazon" : "on Amazon"}`, 100 + ctx.measureText(stars).width + 80, ty + 24);

  // Riga del perche
  if (gift.reason) {
    ctx.fillStyle = MUTED;
    ctx.font = "500 34px system-ui, sans-serif";
    const reasonLines = wrapText(ctx, gift.reason, W - 200, 2);
    let ry = ty + 110;
    for (const line of reasonLines) {
      ctx.fillText(line, 100, ry);
      ry += 48;
    }
  }

  // Divisore aura
  const divGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
  divGrad.addColorStop(0, "rgba(255,61,127,0)");
  divGrad.addColorStop(0.3, "rgba(255,61,127,0.5)");
  divGrad.addColorStop(0.7, "rgba(255,178,77,0.5)");
  divGrad.addColorStop(1, "rgba(255,178,77,0)");
  ctx.fillStyle = divGrad;
  ctx.fillRect(100, H - 210, W - 200, 3);

  // Firma Kado
  const logoGrad = ctx.createLinearGradient(100, H - 160, 176, H - 84);
  logoGrad.addColorStop(0, MAGENTA);
  logoGrad.addColorStop(1, GOLD);
  ctx.save();
  ctx.shadowColor = "rgba(255,61,127,0.55)";
  ctx.shadowBlur = 36;
  roundRect(ctx, 100, H - 160, 76, 76, 22);
  ctx.fillStyle = logoGrad;
  ctx.fill();
  ctx.restore();
  drawGiftGlyph(ctx, 138, H - 122, 40);

  ctx.fillStyle = TEXT;
  ctx.font = "900 40px Archivo, system-ui, sans-serif";
  ctx.fillText("Kado AI", 206, H - 138);
  ctx.fillStyle = MUTED;
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillText(isIt ? "Il regalo perfetto in 20 secondi" : "The perfect gift in 20 seconds", 206, H - 100);

  ctx.fillStyle = MAGENTA;
  ctx.font = "800 30px Archivo, system-ui, sans-serif";
  const cta = isIt ? "TROVA IL TUO" : "FIND YOURS";
  ctx.fillText(cta, W - 100 - ctx.measureText(cta).width, H - 118);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export async function shareGiftCard(
  gift: GiftItem,
  foundInSeconds: number | null,
  language: string,
  amazonUrl: string
): Promise<"shared" | "downloaded" | "failed"> {
  const isIt = language === "it";
  const seconds = foundInSeconds && foundInSeconds > 0 && foundInSeconds <= 20 ? foundInSeconds : 20;
  const shareText = isIt
    ? `${gift.title} — trovato da Kado AI in ${seconds} secondi. ${amazonUrl}`
    : `${gift.title} — found by Kado AI in ${seconds} seconds. ${amazonUrl}`;

  let blob: Blob | null = null;
  try {
    blob = await buildShareCardBlob(gift, foundInSeconds, language);
  } catch (e) {
    blob = null;
  }

  if (blob && typeof navigator !== "undefined" && navigator.share) {
    const file = new File([blob], "kado-regalo.png", { type: "image/png" });
    // canShare con files: alcuni browser (desktop) supportano share ma non
    // i file — in quel caso si condivide solo il testo con il link.
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
        return "shared";
      }
      await navigator.share({ text: shareText });
      return "shared";
    } catch (e) {
      // L'utente puo aver annullato lo share sheet: non e un errore da
      // degradare in download automatico.
      if ((e as DOMException)?.name === "AbortError") return "failed";
    }
  }

  if (blob) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kado-regalo.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return "downloaded";
    } catch (e) {
      // fallthrough
    }
  }
  return "failed";
}

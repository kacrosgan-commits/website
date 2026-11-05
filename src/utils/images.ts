import fs from "node:fs";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

function existing(src: string): string | undefined {
  return fs.existsSync(path.join(publicDir, src)) ? src : undefined;
}

/** Same-size WebP copy of a PNG screenshot written by `scripts/make_portfolio_webp.py`. */
export function webpCopy(src: string): string | undefined {
  return /\.png$/i.test(src) ? existing(src.replace(/\.png$/i, ".webp")) : undefined;
}

/** Smaller WebP copy used on portfolio cards, when one exists. */
export function cardCopy(src: string): string | undefined {
  return /\.(png|jpe?g)$/i.test(src) ? existing(src.replace(/\.(png|jpe?g)$/i, ".card.webp")) : undefined;
}

/**
 * 16:9 crop of a website capture for the browser-frame card, written by `scripts/make_card_frames.py`.
 * The browser scrollbar and the partial content below a natural break are removed. Case-study pages
 * keep the original screenshot.
 */
export function frameCopy(src: string): string | undefined {
  return /\.(png|jpe?g)$/i.test(src) ? existing(src.replace(/\.(png|jpe?g)$/i, ".frame.webp")) : undefined;
}

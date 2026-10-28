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

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { DirectusClient } from "./directus-client.server.ts";

const ALLOWED_MIME = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "image/jpg",
]);

const MAX_BYTES: Record<string, number> = {
  "image/webp": 8 * 1024 * 1024,
  "image/jpeg": 8 * 1024 * 1024,
  "image/jpg": 8 * 1024 * 1024,
  "image/png": 12 * 1024 * 1024,
  "video/mp4": 20 * 1024 * 1024,
};

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 12) {
    const head = String.fromCharCode(...bytes.slice(0, 4));
    if (head.startsWith("\x89PNG")) return "image/png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
    if (head === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
    if (String.fromCharCode(...bytes.slice(4, 8)) === "ftyp") return "video/mp4";
  }
  return null;
}

export interface MaterializedAsset {
  fileId: string;
  publicPath: string;
  sha256: string;
  bytes: number;
  contentType: string;
}

/**
 * Authenticated build-time fetch of an approved Directus file into private staging,
 * then a content-hashed public path under dist/cms-media (caller copies).
 * Never writes draft media into public/.
 */
export async function materializeApprovedAsset(
  client: DirectusClient,
  fileId: string,
  stagingDir: string,
): Promise<MaterializedAsset> {
  fs.mkdirSync(stagingDir, { recursive: true });
  const downloaded = await client.downloadAsset(fileId);
  if (!downloaded.ok) {
    throw new Error(`Approved media download failed for ${fileId}: HTTP ${downloaded.status}`);
  }
  const sniffed = sniffMime(downloaded.bytes);
  const contentType = sniffed || downloaded.contentType.split(";")[0].trim();
  if (!ALLOWED_MIME.has(contentType)) {
    throw new Error(`Disallowed media MIME for ${fileId}: ${contentType}`);
  }
  const max = MAX_BYTES[contentType] ?? 5 * 1024 * 1024;
  if (downloaded.bytes.byteLength > max) {
    throw new Error(`Media ${fileId} exceeds size limit (${downloaded.bytes.byteLength} > ${max})`);
  }
  // Reject obvious HTML/SVG polyglots for image slots.
  const asText = Buffer.from(downloaded.bytes.slice(0, 256)).toString("utf8").toLowerCase();
  if (asText.includes("<svg") || asText.includes("<html") || asText.includes("<script")) {
    throw new Error(`Media ${fileId} looks like markup and was rejected`);
  }

  const sha256 = crypto.createHash("sha256").update(downloaded.bytes).digest("hex");
  const ext =
    contentType === "image/webp"
      ? "webp"
      : contentType === "image/png"
        ? "png"
        : contentType === "video/mp4"
          ? "mp4"
          : "jpg";
  const fileName = `${sha256}.${ext}`;
  const abs = path.join(stagingDir, fileName);
  fs.writeFileSync(abs, downloaded.bytes);
  return {
    fileId,
    publicPath: `/cms-media/${fileName}`,
    sha256,
    bytes: downloaded.bytes.byteLength,
    contentType,
  };
}

export function cleanCmsMediaOutput(distDir: string) {
  const target = path.join(distDir, "cms-media");
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

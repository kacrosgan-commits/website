#!/usr/bin/env node
/**
 * After `docker compose restart`, confirm the Step 10A test item and file still exist.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);
const state = JSON.parse(fs.readFileSync(path.join(root, ".tmp/verify-state.json"), "utf8"));
const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const headers = { Authorization: `Bearer ${env.ADMIN_TOKEN}` };

async function get(urlPath) {
  const response = await fetch(`${base}${urlPath}`, { headers });
  return { status: response.status, data: await response.json().catch(() => null) };
}

const item = await get(`/items/team_members/${state.itemId}`);
const file = state.fileId ? await get(`/files/${state.fileId}`) : { status: 0 };
const okItem = item.status === 200 && item.data?.data?.slug === "local-test-not-for-publication";
const okFile = !state.fileId || (file.status === 200 && Boolean(file.data?.data?.id));
console.log(JSON.stringify({ okItem, okFile, itemStatus: item.status, fileStatus: file.status }, null, 2));
if (!okItem || !okFile) process.exit(1);

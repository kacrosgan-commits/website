#!/usr/bin/env node
/**
 * Remove the disposable Step 10A test item and upload. Does not touch volumes.
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
const statePath = path.join(root, ".tmp/verify-state.json");
if (!fs.existsSync(statePath)) {
  console.log("No verify-state.json — nothing to clean.");
  process.exit(0);
}
const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
const base = (env.PUBLIC_URL || "http://127.0.0.1:8055").replace(/\/$/, "");
const headers = { Authorization: `Bearer ${env.ADMIN_TOKEN}` };

async function del(urlPath) {
  const response = await fetch(`${base}${urlPath}`, { method: "DELETE", headers });
  return response.status;
}

if (state.itemId) console.log("delete item", await del(`/items/team_members/${state.itemId}`));
if (state.fileId) console.log("delete file", await del(`/files/${state.fileId}`));
fs.unlinkSync(statePath);
console.log("cleaned");

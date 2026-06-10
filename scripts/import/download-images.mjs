// Downloads the referenced images into public/import/, preserving subpaths.
// Usage: node scripts/import/download-images.mjs
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const urls = readFileSync(join(root, "data", "image-urls.txt"), "utf8")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const publicImport = join(root, "public", "import");
const CONCURRENCY = 12;
let ok = 0;
let fail = 0;
const failures = [];

async function one(url) {
  const rel = url.replace(/^https?:\/\/riphxan\.com\/mua\/images\//, "");
  const dest = join(publicImport, rel);
  if (existsSync(dest)) {
    ok++;
    return;
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    ok++;
  } catch (e) {
    fail++;
    failures.push(`${url} — ${e.message}`);
  }
}

async function run() {
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      await one(url);
      if ((ok + fail) % 50 === 0) {
        process.stdout.write(`\r${ok + fail}/${urls.length} (ok ${ok}, fail ${fail})`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  process.stdout.write(`\rDone: ${ok} downloaded, ${fail} failed of ${urls.length}\n`);
  if (failures.length) {
    writeFileSync(join(root, "data", "image-failures.txt"), failures.join("\n"));
    console.log("Failures written to data/image-failures.txt");
    console.log(failures.slice(0, 10).join("\n"));
  }
}
run();

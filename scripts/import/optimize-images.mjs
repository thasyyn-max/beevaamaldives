// Resizes/compresses public/import images in place for a fast mobile-first site.
// Max long edge 1280px; JPEG q72 / PNG compressed. Usage: node scripts/import/optimize-images.mjs
import { readdirSync, statSync, renameSync, rmSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const base = join(root, "public", "import");
const MAX = 1280;

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(base);
let before = 0;
let after = 0;
let done = 0;

for (const file of files) {
  before += statSync(file).size;
  const ext = extname(file).toLowerCase();
  const tmp = file + ".tmp";
  try {
    let img = sharp(file, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    if ((meta.width ?? 0) > MAX || (meta.height ?? 0) > MAX) {
      img = img.resize(MAX, MAX, { fit: "inside", withoutEnlargement: true });
    }
    if (ext === ".png") {
      await img.png({ compressionLevel: 9, palette: true }).toFile(tmp);
    } else {
      await img.jpeg({ quality: 72, mozjpeg: true }).toFile(tmp);
    }
    rmSync(file);
    renameSync(tmp, file);
  } catch (e) {
    console.error("skip", basename(file), e.message);
    try { rmSync(tmp); } catch {}
  }
  after += statSync(file).size;
  if (++done % 50 === 0) process.stdout.write(`\r${done}/${files.length}`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";
process.stdout.write(
  `\rOptimized ${done} images: ${mb(before)} -> ${mb(after)}\n`
);

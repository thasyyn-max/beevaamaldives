// Generates abstract Maldives-themed SVG placeholder photos into public/demo/.
// Run: node scripts/generate-demo-images.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "demo");
mkdirSync(outDir, { recursive: true });

const beachPalettes = [
  { sky: ["#bae6fd", "#7dd3fc"], sea: ["#22d3ee", "#0e7490"], sun: "#fef08a", sand: "#fef3c7" },
  { sky: ["#fde68a", "#fb923c"], sea: ["#2dd4bf", "#0f766e"], sun: "#fff7ed", sand: "#fde68a" },
  { sky: ["#a5f3fc", "#38bdf8"], sea: ["#34d399", "#047857"], sun: "#fefce8", sand: "#fef9c3" },
  { sky: ["#c7d2fe", "#818cf8"], sea: ["#22d3ee", "#155e75"], sun: "#fde68a", sand: "#e0e7ff" },
  { sky: ["#fbcfe8", "#f472b6"], sea: ["#5eead4", "#0d9488"], sun: "#fff1f2", sand: "#fce7f3" },
  { sky: ["#99f6e4", "#2dd4bf"], sea: ["#0ea5e9", "#075985"], sun: "#fef9c3", sand: "#ccfbf1" },
];

function beach(p, i) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sea[0]}"/><stop offset="1" stop-color="${p.sea[1]}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="340" fill="url(#sky)"/>
  <circle cx="${160 + i * 90}" cy="120" r="52" fill="${p.sun}" opacity="0.9"/>
  <ellipse cx="${560 - i * 40}" cy="330" rx="190" ry="26" fill="#115e59" opacity="0.55"/>
  <g transform="translate(${540 - i * 40},250)" fill="#134e4a" opacity="0.7">
    <rect x="-4" y="30" width="8" height="56" rx="3"/>
    <path d="M0 34 C -50 10 -70 18 -88 34 C -52 26 -20 30 0 38 Z"/>
    <path d="M0 34 C 50 10 70 18 88 34 C 52 26 20 30 0 38 Z"/>
    <path d="M0 32 C -30 -6 -10 -16 4 -22 C -6 -2 -2 16 2 34 Z"/>
  </g>
  <rect y="340" width="800" height="260" fill="url(#sea)"/>
  <path d="M0 380 Q 100 368 200 380 T 400 380 T 600 380 T 800 380" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.5"/>
  <path d="M0 440 Q 100 428 200 440 T 400 440 T 600 440 T 800 440" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.35"/>
  <path d="M0 600 L 0 520 Q 200 488 420 530 Q 640 572 800 540 L 800 600 Z" fill="${p.sand}" opacity="0.95"/>
</svg>`;
}

const roomPalettes = [
  { wall: ["#f0fdfa", "#ccfbf1"], bed: "#0f766e", sheet: "#ffffff", floor: "#e7e5e4", accent: "#f59e0b" },
  { wall: ["#eff6ff", "#dbeafe"], bed: "#1d4ed8", sheet: "#f8fafc", floor: "#e2e8f0", accent: "#10b981" },
  { wall: ["#fffbeb", "#fef3c7"], bed: "#b45309", sheet: "#fffbeb", floor: "#f5f5f4", accent: "#0ea5e9" },
  { wall: ["#fdf4ff", "#fae8ff"], bed: "#7e22ce", sheet: "#faf5ff", floor: "#e7e5e4", accent: "#14b8a6" },
];

function room(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.wall[0]}"/><stop offset="1" stop-color="${p.wall[1]}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="430" fill="url(#wall)"/>
  <rect y="430" width="800" height="170" fill="${p.floor}"/>
  <rect x="90" y="90" width="200" height="150" rx="8" fill="#7dd3fc" stroke="#ffffff" stroke-width="10"/>
  <path d="M90 200 Q 140 170 190 200 T 290 200 L 290 240 L 90 240 Z" fill="#0ea5e9" opacity="0.7"/>
  <circle cx="150" cy="130" r="18" fill="#fef08a"/>
  <rect x="360" y="250" width="360" height="180" rx="14" fill="${p.bed}"/>
  <rect x="360" y="250" width="360" height="70" rx="14" fill="${p.sheet}"/>
  <rect x="385" y="225" width="120" height="46" rx="10" fill="${p.sheet}" stroke="${p.floor}" stroke-width="3"/>
  <rect x="520" y="225" width="120" height="46" rx="10" fill="${p.sheet}" stroke="${p.floor}" stroke-width="3"/>
  <rect x="350" y="430" width="380" height="16" rx="6" fill="#a8a29e"/>
  <rect x="640" y="330" width="14" height="60" fill="${p.accent}"/>
  <circle cx="647" cy="318" r="22" fill="${p.accent}" opacity="0.85"/>
</svg>`;
}

beachPalettes.forEach((p, i) => writeFileSync(join(outDir, `beach-${i + 1}.svg`), beach(p, i)));
roomPalettes.forEach((p, i) => writeFileSync(join(outDir, `room-${i + 1}.svg`), room(p)));
console.log(`Wrote ${beachPalettes.length} beach + ${roomPalettes.length} room SVGs to public/demo/`);

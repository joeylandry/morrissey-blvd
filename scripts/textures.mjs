// Renders the paper/film textures to small tiling PNGs (run once:
// `node scripts/textures.mjs`). Pre-rendered tiles are far cheaper for the
// browser than SVG feTurbulence backgrounds, which re-render on every paint.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
function png(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Tileable value noise at a given cell size.
function valueNoise(size, cell) {
  const g = size / cell;
  const grid = Array.from({ length: g * g }, rnd);
  const at = (x, y) => grid[((y + g) % g) * g + ((x + g) % g)];
  const s = (t) => t * t * (3 - 2 * t);
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const gx = x / cell, gy = y / cell;
      const x0 = Math.floor(gx), y0 = Math.floor(gy);
      const tx = s(gx - x0), ty = s(gy - y0);
      const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
      const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
      out[y * size + x] = a + (b - a) * ty;
    }
  return out;
}

function write(name, size, color, alphaAt) {
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    buf[i * 4] = color[0];
    buf[i * 4 + 1] = color[1];
    buf[i * 4 + 2] = color[2];
    buf[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(alphaAt(i) * 255)));
  }
  writeFileSync(new URL(`../public/tex/${name}.png`, import.meta.url), png(size, size, buf));
}

// Paper fibres: fine speckle plus a little mid-scale mottling.
{
  const size = 256;
  const mid = valueNoise(size, 16);
  const fine = valueNoise(size, 2);
  write("paper", size, [64, 42, 24], (i) => 0.04 + Math.pow(rnd(), 3) * 0.22 + fine[i] * 0.08 + mid[i] * 0.07);
}
// Big soft blotches, like old stained stock.
{
  const size = 512;
  const a = valueNoise(size, 128);
  const b = valueNoise(size, 32);
  write("blotch", size, [80, 46, 20], (i) => Math.max(0, a[i] * 0.7 + b[i] * 0.3 - 0.45) * 0.55);
}
// Film grain: light and dark specks on transparent.
{
  const size = 256;
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = rnd();
    const light = v > 0.5;
    buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = light ? 245 : 10;
    buf[i * 4 + 3] = Math.round(Math.pow(Math.abs(v - 0.5) * 2, 2.2) * 140);
  }
  writeFileSync(new URL("../public/tex/grain.png", import.meta.url), png(size, size, buf));
}
console.log("textures written");

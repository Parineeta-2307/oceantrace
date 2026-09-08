import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const W = 512;
const H = 512;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const payload = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(payload));
  return Buffer.concat([len, payload, crc]);
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x0cea7);

const pixels = Buffer.alloc(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const nx = (x - W / 2) / W;
    const ny = (y - H / 2) / H;
    const speckle = Math.pow(rand(), 0.55) * 210 + 28;
    const rangeBand = 12 * Math.sin(y * 0.35) * (0.4 + rand() * 0.3);
    const rx = nx * Math.cos(0.55) + ny * Math.sin(0.55);
    const ry = -nx * Math.sin(0.55) + ny * Math.cos(0.55);
    const slick = Math.exp(-(rx * rx) / 0.0048 - (ry * ry) / 0.00055);
    const lookalike = Math.exp(-((nx + 0.22) ** 2) / 0.01 - ((ny - 0.18) ** 2) / 0.018) * 0.25;
    const v = Math.max(8, Math.min(235, speckle + rangeBand - slick * 165 - lookalike * 70));
    pixels[y * W + x] = v | 0;
  }
}

const raw = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W + 1)] = 0;
  pixels.copy(raw, y * (W + 1) + 1, y * W, (y + 1) * W);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets/sar-detection.png");
await mkdir(dirname(out), { recursive: true });
createWriteStream(out).end(png);
console.log("wrote", out);

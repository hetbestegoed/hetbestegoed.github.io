import sharp from "sharp";
import { get } from "https";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "static");

const MAPS = [
  {
    lat: 51.987485,
    lon: 5.49561,
    zoom: 18,
    output: "locatie-kaart.png",
    alt: "Locatie Tabaksweg 20 Elst",
  },
  {
    lat: 51.987478,
    lon: 5.494756,
    zoom: 18,
    output: "avond4daagse-locatie.png",
    alt: "Startlocatie Het Eiveld Elst",
  },
];

const OUT_W = 680;
const OUT_H = 300;
const TILE_SIZE = 256;
const PIN_W = 22;
const PIN_H = 30;

const PIN_SVG = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}">
    <path d="M11 0 C4.9 0 0 4.9 0 11 C0 19.3 11 30 11 30 C11 30 22 19.3 22 11 C22 4.9 17.1 0 11 0 Z"
      fill="#2563eb" stroke="#1e40af" stroke-width="1"/>
    <circle cx="11" cy="11" r="5" fill="white"/>
  </svg>`,
);

function tileCoords(lat, lon, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y, n };
}

function pixelOffset(lat, lon, zoom, tileX, tileY) {
  const n = Math.pow(2, zoom);
  const px = (((lon + 180) / 360) * n - tileX) * TILE_SIZE;
  const latRad = (lat * Math.PI) / 180;
  const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n - tileY;
  return { px, py: py * TILE_SIZE };
}

function fetchTile(x, y, zoom) {
  return new Promise((resolve, reject) => {
    const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
    const chunks = [];
    get(url, { headers: { "User-Agent": "hetbestegoed.nl map generator" } }, (res) => {
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function generateMap({ lat, lon, zoom, output }) {
  const { x: tileX, y: tileY } = tileCoords(lat, lon, zoom);

  // Download 3x3 grid of tiles centred on the target tile
  const grid = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      grid.push({ dx, dy, buf: await fetchTile(tileX + dx, tileY + dy, zoom) });
    }
  }

  const totalW = 3 * TILE_SIZE;
  const totalH = 3 * TILE_SIZE;

  // Pixel of target coord within the 3x3 canvas (centre tile is at offset TILE_SIZE)
  const { px, py } = pixelOffset(lat, lon, zoom, tileX, tileY);
  const markerX = px + TILE_SIZE;
  const markerY = py + TILE_SIZE;

  // Crop region centred on the marker
  const left = Math.max(0, Math.min(Math.round(markerX - OUT_W / 2), totalW - OUT_W));
  const top = Math.max(0, Math.min(Math.round(markerY - OUT_H / 2), totalH - OUT_H));

  const tileComposites = grid.map(({ dx, dy, buf }) => ({
    input: buf,
    left: (dx + 1) * TILE_SIZE,
    top: (dy + 1) * TILE_SIZE,
  }));

  const stitched = await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(tileComposites)
    .png()
    .toBuffer();

  const cropped = await sharp(stitched)
    .extract({ left, top, width: OUT_W, height: OUT_H })
    .png()
    .toBuffer();

  const pinX = Math.round(markerX - left - PIN_W / 2);
  const pinY = Math.round(markerY - top - PIN_H);

  await sharp(cropped)
    .composite([{ input: PIN_SVG, left: pinX, top: pinY }])
    .png()
    .toFile(join(STATIC, output));

  console.log(`generated ${output}`);
}

for (const map of MAPS) {
  await generateMap(map);
}

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const CONTENT_CONFIG = join(ROOT, "content.yaml");
const INDEX_HTML = join(ROOT, "avond-4daagse-elst", "index.html");

function replaceMarkers(html, startMarker, endMarker, content) {
  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find markers: ${startMarker} and ${endMarker}`);
  }
  return (
    html.substring(0, startIndex + startMarker.length) +
    content +
    html.substring(endIndex)
  );
}

function generateRouteHtml(route, dag, afstand) {
  let html = `
        <article>
          <h3 class="text-l pb-2 font-bold">Dag ${dag} - ${afstand}</h3>`;

  if (route.afstandmeten_id) {
    html += `
          <iframe src="https://www.afstandmeten.nl/embed.php?id=${route.afstandmeten_id}&kmStep=1"></iframe>
          <a href="https://www.afstandmeten.nl/index.php?id=${route.afstandmeten_id}" target="_blank" class="display-block text-blue-600 visited:text-purple-600 focus:underline hover:underline">Bekijk route op afstandmeten</a><br>`;
  }

  html += `
          <a href="/public/documents/${route.doc}" target="_blank" class="display-block text-blue-600 visited:text-purple-600 focus:underline hover:underline">Routebeschrijving: ${route.doc}</a>
        </article>`;

  return html;
}

function generateRoutesHtml(routes, label) {
  if (!routes.length) return "";

  const items = routes
    .map((route, i) => generateRouteHtml(route, i + 1, label.toUpperCase()))
    .join("\n");

  return `
      <h3 class="text-xl pt-5 font-bold">Routes ${label}</h3>
      <div class="py-2">${items}
      </div>`;
}

function generateSponsorsHtml(sponsors) {
  return sponsors
    .map((image) => `          <img src="/${image}" />`)
    .join("\n");
}

function generatePhotosHtml(photos) {
  const columns = [[], [], [], []];
  photos.forEach((photo, i) => {
    columns[(i + 1) % 4].push(`/${photo}`);
  });
  return columns
    .map((columnImages) => {
      const images = columnImages
        .map(
          (p) =>
            `          <a href="${p}" target="_blank"><img src="${p}" loading="lazy" class="w-100 align-middle p-1 border-box" /></a>`,
        )
        .join("\n");
      return `        <div class="w-1/4 flex flex-col flex-auto">\n${images}\n        </div>`;
    })
    .join("\n");
}

async function generate() {
  const yamlContent = await readFile(CONTENT_CONFIG, "utf-8");
  const config = yaml.load(yamlContent);
  const { routes, sponsors, photos } = config.avond4daagse;

  let html = await readFile(INDEX_HTML, "utf-8");

  html = replaceMarkers(
    html,
    "<!-- ROUTES_5_START -->",
    "<!-- ROUTES_5_END -->",
    generateRoutesHtml(routes.km5, "5km"),
  );
  html = replaceMarkers(
    html,
    "<!-- ROUTES_10_START -->",
    "<!-- ROUTES_10_END -->",
    generateRoutesHtml(routes.km10, "10km"),
  );
  html = replaceMarkers(
    html,
    "<!-- SPONSORS_START -->",
    "<!-- SPONSORS_END -->",
    generateSponsorsHtml(sponsors),
  );
  html = replaceMarkers(
    html,
    "<!-- PHOTOS_START -->",
    "<!-- PHOTOS_END -->",
    generatePhotosHtml(photos),
  );

  await writeFile(INDEX_HTML, html);
  console.log("Generated avond4daagse HTML in avond-4daagse-elst/index.html");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

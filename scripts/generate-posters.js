/**
 * Poster generator for hetbestegoed.nl
 *
 * This script reads poster configuration from content.yaml and generates
 * the HTML for the poster section in index.html.
 *
 * Usage: node scripts/generate-posters.js
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const CONTENT_CONFIG = join(ROOT, "content.yaml");
const INDEX_HTML = join(ROOT, "index.html");
const POSTER_START_MARKER = "<!-- POSTERS_START -->";
const POSTER_END_MARKER = "<!-- POSTERS_END -->";

/**
 * Generates HTML for a poster with a ticket button.
 */
function generatePosterWithButton(poster) {
  return `
        <article class="rounded-md overflow-clip border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-300 dark:bg-neutral-700">
          <div class="overflow-clip">
            <img class="w-full" src="${poster.image}" />
          </div>
          <div class="text-center py-5">
            <a
              href="${poster.ticketLink}"
              target="_blank"
              rel="nofollow"
              class="bg-blue-600 inline-block px-5 py-2 rounded-md text-white border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 dark:hover:bg-blue-500 dark:hover:border-blue-500 uppercase"
            >
              ${poster.buttonText}
            </a>
          </div>
        </article>`;
}

/**
 * Generates HTML for a poster without a button.
 */
function generatePosterWithoutButton(poster) {
  return `
        <div class="mb-5">
          <div class="rounded-md overflow-clip w-full border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-300 dark:bg-neutral-700">
            <img class="w-full" src="${poster.image}" />
          </div>
        </div>`;
}

/**
 * Generates HTML for all posters.
 */
function generatePostersHtml(posters) {
  const postersHtml = posters
    .map((poster) => {
      if (poster.ticketLink && poster.buttonText) {
        return generatePosterWithButton(poster);
      }
      return generatePosterWithoutButton(poster);
    })
    .join("\n");

  return postersHtml;
}

/**
 * Main generator function.
 */
async function generate() {
  // Read YAML configuration
  const yamlContent = await readFile(CONTENT_CONFIG, "utf-8");
  const config = yaml.load(yamlContent);
  const posters = config.posters || [];

  console.log(`Loaded ${posters.length} poster(s) from configuration`);

  // Generate HTML
  const postersHtml = generatePostersHtml(posters);

  // Read index.html
  let html = await readFile(INDEX_HTML, "utf-8");

  // Replace content between markers
  const startIndex = html.indexOf(POSTER_START_MARKER);
  const endIndex = html.indexOf(POSTER_END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      `Could not find poster markers in index.html. Please add ${POSTER_START_MARKER} and ${POSTER_END_MARKER}`,
    );
  }

  const before = html.substring(0, startIndex + POSTER_START_MARKER.length);
  const after = html.substring(endIndex);
  html = before + postersHtml + after;

  // Write updated HTML
  await writeFile(INDEX_HTML, html);
  console.log("Generated poster HTML in index.html");
}

// Run generator
generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Activity generator for hetbestegoed.nl
 *
 * This script reads activity configuration from activities.yaml and generates
 * the HTML for the activities section in index.html.
 *
 * Usage: node scripts/generate-activities.js
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, "..");
const ACTIVITIES_CONFIG = join(ROOT, "activities.yaml");
const INDEX_HTML = join(ROOT, "index.html");
const ACTIVITIES_START_MARKER = "<!-- ACTIVITIES_START -->";
const ACTIVITIES_END_MARKER = "<!-- ACTIVITIES_END -->";

/**
 * Generates HTML for a single activity.
 */
function generateActivityHtml(activity) {
  const costHtml = activity.cost
    ? `<p><span class="font-bold">Kosten:</span> ${activity.cost}.</p>`
    : "";

  const descriptionHtml = activity.description
    ? `<p class="py-3">\n                ${activity.description}\n              </p>`
    : "";

  return `
          <article
            class="rounded-md shadow-md overflow-clip sm:flex text-left border-2 border-solid border-neutral-100 dark:border-neutral-700"
          >
            <img src="${activity.image}" width="200" height="200" />
            <div class="px-5 py-3">
              <h1 class="text-2xl text-neutral-800 dark:text-neutral-200">
                ${activity.title}
              </h1>${descriptionHtml ? `\n              ${descriptionHtml}` : ""}
              <p>
                <span class="font-bold">Wanneer:</span> ${activity.when}
              </p>
              ${costHtml}
            </div>
          </article>`;
}

/**
 * Generates HTML for all activities.
 */
function generateActivitiesHtml(activities) {
  return activities.map(generateActivityHtml).join("\n");
}

/**
 * Main generator function.
 */
async function generate() {
  // Read YAML configuration
  const yamlContent = await readFile(ACTIVITIES_CONFIG, "utf-8");
  const config = yaml.load(yamlContent);
  const activities = config.activities || [];

  console.log(`Loaded ${activities.length} activit${activities.length === 1 ? "y" : "ies"} from configuration`);

  // Generate HTML
  const activitiesHtml = generateActivitiesHtml(activities);

  // Read index.html
  let html = await readFile(INDEX_HTML, "utf-8");

  // Replace content between markers
  const startIndex = html.indexOf(ACTIVITIES_START_MARKER);
  const endIndex = html.indexOf(ACTIVITIES_END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      `Could not find activities markers in index.html. Please add ${ACTIVITIES_START_MARKER} and ${ACTIVITIES_END_MARKER}`,
    );
  }

  const before = html.substring(0, startIndex + ACTIVITIES_START_MARKER.length);
  const after = html.substring(endIndex);
  html = before + activitiesHtml + after;

  // Write updated HTML
  await writeFile(INDEX_HTML, html);
  console.log("Generated activities HTML in index.html");
}

// Run generator
generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

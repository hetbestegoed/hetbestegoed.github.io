/**
 * Build script for hetbestegoed.nl
 *
 * This script post-processes the static HTML files.
 * It performs the following optimizations:
 *
 * 1. Image optimization - Compresses JPEG/PNG images
 * 2. CSS inlining - Inlines external stylesheets into <style> tags
 * 3. CSS minification - Minifies CSS using csso
 * 4. HTML minification - Removes whitespace and comments
 *
 * Note: Tailwind v4 already handles CSS purging during build,
 * so we don't need PurgeCSS (which also has issues with :where() selectors).
 *
 * Usage: node build.js
 * Environment: BUILD_DIR can override the default "dist" directory
 */

import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { minify as minifyCss } from "csso";
import { minify as minifyHtml } from "html-minifier-terser";
import sharp from "sharp";

const SOURCE = process.env.BUILD_DIR || "dist";
const ROOT = dirname(fileURLToPath(import.meta.url));

/**
 * Recursively finds all files with a given extension in a directory.
 * @param {string} dir - Directory to search
 * @param {string} ext - File extension to match (e.g., ".html")
 * @returns {Promise<string[]>} Array of absolute file paths
 */
async function findFiles(dir, ext) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findFiles(fullPath, ext)));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Optimizes a single image file.
 *
 * @param {string} filePath - Absolute path to the image file
 */
async function optimizeImage(filePath) {
  const ext = filePath.toLowerCase().split('.').pop();

  if (ext === 'jpg' || ext === 'jpeg') {
    await sharp(filePath)
      .jpeg({ quality: 85, progressive: true, mozjpeg: true })
      .toFile(filePath + '.tmp');
    await unlink(filePath);
    await writeFile(filePath, await readFile(filePath + '.tmp'));
    await unlink(filePath + '.tmp');
  } else if (ext === 'png') {
    await sharp(filePath)
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(filePath + '.tmp');
    await unlink(filePath);
    await writeFile(filePath, await readFile(filePath + '.tmp'));
    await unlink(filePath + '.tmp');
  }
}

/**
 * Processes a single HTML file through all optimization steps.
 *
 * @param {string} filePath - Absolute path to the HTML file
 * @param {string} baseCss - Pre-loaded CSS content to inline
 */
async function processHtml(filePath, baseCss) {
  let html = await readFile(filePath, "utf-8");

  // Step 1: Inline CSS - remove stylesheet links and add combined CSS
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, "");
  html = html.replace("</head>", `<style>${baseCss}</style></head>`);

  // Step 2: Minify inlined CSS
  // Note: Tailwind v4 already purges unused CSS during build, so we skip PurgeCSS
  // PurgeCSS has issues with Tailwind v4's :where() selectors
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const minifiedCss = minifyCss(styleMatch[1]).css;
    html = html.replace(styleMatch[0], `<style>${minifiedCss}</style>`);
  }

  // Step 3: Final HTML minification
  const minified = await minifyHtml(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeAttributeQuotes: true,
    removeOptionalTags: true,
  });

  await writeFile(filePath, minified);
}

/**
 * Main build function.
 * Processes all HTML, CSS, and image files in the source directory.
 */
async function build() {
  const start = performance.now();
  const sourceDir = join(ROOT, SOURCE);

  // Optimize images
  console.log('Optimizing images...');
  const jpgFiles = await findFiles(sourceDir, ".jpg");
  const jpegFiles = await findFiles(sourceDir, ".jpeg");
  const pngFiles = await findFiles(sourceDir, ".png");
  const imageFiles = [...jpgFiles, ...jpegFiles, ...pngFiles];
  console.log(`Optimizing ${imageFiles.length} image(s)...`);
  await Promise.all(imageFiles.map(optimizeImage));
  console.log(`Optimized ${imageFiles.length} image(s)`);

  // Load all CSS files into memory
  const cssFiles = await findFiles(sourceDir, ".css");
  const cssContents = await Promise.all(
    cssFiles.map((file) => readFile(file, "utf-8")),
  );
  const baseCss = cssContents.join("");
  console.log(`Loaded ${cssFiles.length} CSS file(s)`);

  // Process each HTML file
  const htmlFiles = await findFiles(sourceDir, ".html");
  console.log(`Processing ${htmlFiles.length} HTML file(s)...`);
  await Promise.all(htmlFiles.map((file) => processHtml(file, baseCss)));

  // Clean up CSS files (now inlined)
  await Promise.all(cssFiles.map(unlink));
  console.log(`Removed ${cssFiles.length} CSS file(s)`);

  const elapsed = ((performance.now() - start) / 1000).toFixed(2);
  console.log(`Build complete in ${elapsed}s`);
}

// Run build
build().catch((err) => {
  console.error(err);
  process.exit(1);
});

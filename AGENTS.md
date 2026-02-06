# Het Bestegoed

Static website for Stichting Het Bestegoed built with Tailwind CSS v4.

## Project structure

```
index.html                  # Homepage
avond-4daagse-elst/         # Avond 4Daagse subpage
uitgaansdag-senioren/       # Uitgaansdag Senioren subpage
base.css                    # Tailwind source CSS
public/
  css/styles.css            # Compiled Tailwind output (do not edit manually)
  nieuws/                   # News images
  ...                       # Other images and assets
build.js                    # Production build script (inlines CSS, minifies HTML)
dist/                       # Production build output
```

## Development

Styling is done with Tailwind CSS v4 utility classes directly in HTML files. The source CSS (`base.css`) is compiled to `public/css/styles.css`.

After adding or changing Tailwind classes in HTML, rebuild the CSS:

```sh
pnpm run css:dev    # Watch mode (rebuilds on file changes)
```

To serve locally:

```sh
pnpm run start:dev  # http://localhost:3000
```

## Production build

```sh
pnpm run build:prod
```

This runs the Tailwind build (minified), copies files to `dist/`, inlines CSS into HTML, and minifies the HTML.

To preview the production build:

```sh
pnpm run start:prod  # http://localhost:3000 (serves from dist/)
```

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

## Posters

Posters are event images/flyers displayed in a grid on the homepage. They have consistent styling:

- Border: `border-2 border-neutral-300 dark:border-neutral-700`
- Background: `bg-neutral-300 dark:bg-neutral-700` (applied to hide whitespace in image files)
- Border radius: `rounded-md`

There are two types of posters:

1. **Posters with ticket buttons**: Wrapped in `<article>` tags with a button div below the image
   - Background is applied to the `<article>` element
   - Button uses `bg-blue-600` with hover states

2. **Posters without buttons**: Simple image in a `<div>` container
   - Background is applied to the container div

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

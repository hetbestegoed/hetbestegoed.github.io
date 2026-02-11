# Het Bestegoed

Static website for Stichting Het Bestegoed built with Tailwind CSS v4.

## Project structure

```
index.html                  # Homepage
avond-4daagse-elst/         # Avond 4Daagse subpage
uitgaansdag-senioren/       # Uitgaansdag Senioren subpage
base.css                    # Tailwind source CSS
posters.yaml                # Poster configuration
activities.yaml             # Activities configuration
public/
  css/styles.css            # Compiled Tailwind output (do not edit manually)
  posters/                  # Event poster images
  nieuws/                   # News images
  ...                       # Other images and assets
scripts/
  build.js                  # Production build script (inlines CSS, minifies HTML, optimizes images)
  generate-posters.js       # Generates poster HTML from posters.yaml
  generate-activities.js    # Generates activities HTML from activities.yaml
dist/                       # Production build output
```

## Posters

Posters are event images/flyers displayed in a grid on the homepage. They are managed through a YAML configuration file.

### Configuration

Edit `posters.yaml` to add, remove, or reorder posters. The order in the YAML file determines display order.

```yaml
posters:
  - image: public/posters/music-night-elst.jpg
    ticketLink: https://stichting-het-bestegoed.tickable.nl/music-night-elst
    buttonText: Koop kaartje

  - image: public/posters/flyer-without-button.jpg
```

**Fields:**
- `image` (required): Path to the poster image
- `ticketLink` (optional): URL for ticket purchase
- `buttonText` (optional): Button text (requires ticketLink)

### Generating HTML

Run `pnpm run generate:posters` to generate poster HTML from the YAML configuration. This happens automatically during `pnpm run build:prod`.

### Styling

Posters have consistent styling:
- Border: `border-2 border-neutral-300 dark:border-neutral-700`
- Background: `bg-neutral-300 dark:bg-neutral-700` (hides whitespace in image files)
- Border radius: `rounded-md`

There are two types:

1. **Posters with ticket buttons**: Have `ticketLink` and `buttonText` in YAML
   - Wrapped in `<article>` tags with button below image
   - Button uses `bg-blue-600` with hover states

2. **Posters without buttons**: Only have `image` in YAML
   - Simple image in a `<div>` container

## Activities

Activities are recurring events displayed in the "Activiteiten" section. They are managed through a YAML configuration file.

### Configuration

Edit `activities.yaml` to add, remove, or reorder activities. The order in the YAML file determines display order.

```yaml
activities:
  - title: Ouderen Soos
    image: public/foto_soos.jpg
    description: Elke donderdagmiddag van 14.00 - 16.30 uur zijn er activiteiten voor ouderen.
    when: Donderdagmiddag van 14.00 - 16.30

  - title: Dansavond
    image: public/foto_dans.jpg
    description: U kunt dansen en even rusten onder een genot van een hapje en drankje.
    when: Elke eerste zaterdag van de maand 20.00 - 23.00
    cost: "5 euro"
```

**Fields:**
- `title` (required): Activity name
- `image` (required): Path to the activity image
- `description` (optional): Description of the activity
- `when` (required): When the activity takes place
- `cost` (optional): Cost to participate

### Generating HTML

Run `pnpm run generate:activities` to generate activity HTML from the YAML configuration. This happens automatically during `pnpm run build:prod`.

You can also run `pnpm run generate:content` to regenerate both posters and activities.

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

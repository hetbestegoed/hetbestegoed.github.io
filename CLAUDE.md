## Posters

Edit the `posters` section in `content.yaml` to add, remove, or reorder posters. The order in the YAML file determines display order.

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

## Activities

Edit the `activities` section in `content.yaml` to add, remove, or reorder activities. The order in the YAML file determines display order.

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

## Avond 4Daagse

Edit the `avond4daagse` section in `content.yaml` to update routes, sponsors, and photos. Run `node scripts/generate-avond4daagse.js` (or `mise run generate:avond4daagse`) after editing.

```yaml
avond4daagse:
  routes:
    km5:
      - doc: "A4D_2025/A4D Elst 2025 Dag 1, 5 km. compleet.docx"
        afstandmeten_id: "3710630"  # optional
    km10:
      - doc: "A4D_2025/A4D Elst 2025 Dag 1, 9,7 km. compleet.docx"
  sponsors:
    - public/sponsoren_a4d/0.jpg
  photos:
    - public/photos-2023/avond-4daagse-elst-2023-00001.jpg
    - public/photos-2023/avond-4daagse-elst-2023-00002.jpg
```

**Route fields:**
- `doc` (required): Filename under `public/documents/`
- `afstandmeten_id` (optional): ID for afstandmeten.nl embed and link

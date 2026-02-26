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

# Daily Edit — simple MVP

## The product

Daily Edit answers one question: **What should I wear today?**

It checks the weather, avoids outfits worn recently, and shows one clear choice. The user can accept it or ask for another. Everything else is secondary.

## Three screens

1. **Today** — one outfit photo, one plain-language reason, one standout detail, **Wear this**, and **Another option**.
2. **Wardrobe** — outfit photos, multi-photo upload, favorite, available/unavailable, and delete.
3. **Recent** — a short list of what was worn so the recommendation does not repeat itself.

## Setup

The user provides a city once for weather and adds around ten outfit photos. Each upload needs only four quick labels:

- Cold, mild, or warm.
- Work or casual.
- Rain-friendly or not.
- Favorite or not.

## Recommendation rule

```text
remove unavailable outfits
remove outfits that do not suit today's simple weather band
remove outfits worn in the last 14 days
prefer favorites
then prefer the least recently worn
```

If every outfit was worn recently, show the safest weather-appropriate option rather than an empty screen.

## Current architecture

This prototype uses plain HTML, CSS, and JavaScript with browser storage and the free Open-Meteo API. It has no build dependencies and can run on a low-cost static host. Personal photos do not leave the browser in this version.

Browser storage is appropriate only for the prototype: it is device-specific and can be cleared. Private cloud storage and sign-in can be considered after the daily experience proves useful.

## Intentionally postponed

- Calendar planning and future occasions.
- Notifications and background scheduling.
- Travel mode.
- Individual garment composition.
- AI tagging and preference learning.
- Statistics and advanced filters.
- Technical scoring controls.

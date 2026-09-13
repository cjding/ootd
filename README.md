# Daily Edit

A simple personal app that checks the weather, avoids recently worn outfits, and gives you one clear answer to: **What should I wear today?**

## What it includes

- One daily outfit recommendation and an **Another option** action.
- Multi-photo outfit upload with four quick labels.
- Favorites and available/unavailable controls.
- One-tap wear logging and a simple Recent list.
- Live weather with a clearly marked saved fallback.
- Seeded sample outfits so you can explore immediately.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm run dev`.
3. Open <http://localhost:4173>.

No package installation is required. Personal uploads stay in this browser's `localStorage`; clearing browser data removes them.

## Checks

- `npm test`
- `npm run lint`
- `npm run build`

## Deploy to GitHub Pages

This repository includes an automatic GitHub Pages workflow. In GitHub, open **Settings → Pages**, select **GitHub Actions** under **Build and deployment**, and push the `main` or `work` branch. The app will be published at `https://cjding.github.io/daily-edit/` after the workflow completes.

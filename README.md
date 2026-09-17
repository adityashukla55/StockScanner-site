# Stock Scanner — site

The landing page for [Stock Scanner](https://github.com/adityashukla55/StockScanner), a browser
extension for tracking stocks and ETFs worldwide.

Static files only. No build step, no dependencies, nothing to compile — `public/` is the site.

Live at **https://stockscanner.pages.dev**.

The Pages project is named `stockscanner`, which is what decides the subdomain. An earlier
attempt asked for `stocks` and got `stocks-3pj` — Cloudflare appends random characters rather
than refuse a name already taken, and `stocks.pages.dev` belongs to someone else.

## Deploy

Connected to Cloudflare Pages, so **a push to `main` publishes the site**. There is no build
step to configure:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(leave empty)* |
| Build output directory | `public` |

Connect it once under **Workers & Pages → stockscanner → Settings → Builds & deployments →
Connect to Git**. Every push then deploys, and each deployment stays reachable for rollback.

Before that connection exists, the manual route still works: **Create deployment**, drag the
`public` folder, done.

## Before deploying, fill in two links

Both at the top of `public/links.js`, in the block marked `EDIT THESE`:

- **The add-on link** — once Firefox review passes. Until then both "Add to Firefox" buttons
  read *Coming to Firefox* rather than pointing nowhere.
- **The source repo** — that button removes itself while unset.

The Buy Me a Coffee link is already set, and matches `src/links.js` in the extension.

## The screenshots

`public/shots/*.png` are real captures of the running dashboard, not mockups — taken through
the dev server with a watchlist that deliberately spans dollars, euros and pence so the
multi-currency handling is visible.

To regenerate them after a UI change, from the extension project:

```bash
npm install --no-save puppeteer-core
npm run dev            # dev server + Yahoo proxy, on :5320
npm run screenshots    # writes into this site's public/shots
```

Captured at 1.5× for retina without the weight of 2× — about 1.1 MB for all five, of which
only the first loads up front; the rest are lazy.

## The carousel

`public/carousel.js` holds the slide list and captions. It is a scroll-snap strip rather than a
transform carousel, so touch swipes, momentum and trackpad gestures are the browser's own.
Arrows, tabs and arrow keys all drive `scrollTo`, and the tabs follow a swipe rather than
fighting it.

Add or reorder slides by editing the `SHOTS` array; nothing else needs to change.

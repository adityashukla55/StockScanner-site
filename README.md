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

## Links

All three are at the top of `public/links.js`, in the block marked `EDIT THESE`:

- **The add-on link** — `https://addons.mozilla.org/firefox/addon/stock-scanner/`, the public
  Firefox listing. Do not use a `moz-extension://…` address: that only works inside one
  person's Firefox, with a random id per install. If the link is ever set back to a
  placeholder, the "Add to Firefox" buttons read *Coming to Firefox* rather than pointing
  nowhere.
- **The source repo** — that button removes itself while unset.
- **Buy Me a Coffee** — matches `src/links.js` in the extension.

## The screenshots

`public/shots/*.png` are real captures of the running dashboard, not mockups — taken through
the dev server with a watchlist that deliberately spans dollars, euros and pence so the
multi-currency handling is visible.

There are seven: Detail, Groups (with the group editor open), Compare, Portfolio,
Projection, Allocation and Backup (the Backup & move panel).

To regenerate them after a UI change, from the extension project (it sits next to this one):

```bash
npm install --no-save puppeteer-core
npm run dev            # dev server + Yahoo proxy, on :5320
npm run screenshots    # writes into ../StockScanner-site/public/shots
```

The script finds Chrome on Windows, macOS and Linux. Set `CHROME` to point at another
browser binary, and `CHROME_PROFILE` to a folder of your own if Chrome refuses to start with
a temporary profile.

Captured at 1440×880 and 1.5× for retina without the weight of 2×. Only the first loads up
front; the rest are lazy.

## The carousel

`public/carousel.js` holds the slide list and captions. It is a scroll-snap strip rather than a
transform carousel, so touch swipes, momentum and trackpad gestures are the browser's own.
Arrows, tabs and arrow keys all drive `scrollTo`, and the tabs follow a swipe rather than
fighting it.

Add or reorder slides by editing the `SHOTS` array; nothing else needs to change.

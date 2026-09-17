/* ------------------------------------------------------------------ *
 *  EDIT THESE — the only three lines on this page you need to change.
 *
 *  A link left as a placeholder never becomes a dead link: the add-on
 *  button says it is still in review, and the other two hide themselves.
 * ------------------------------------------------------------------ */

const LINKS = {
  // Your Buy Me a Coffee page. Keep it the same as src/links.js in the extension.
  sponsor: 'https://buymeacoffee.com/adi.shukla41',

  // Fill in once Firefox review passes.
  addon: 'https://addons.mozilla.org/firefox/addon/YOUR_ADDON',

  // Where the code lives, and where Chrome users get install instructions.
  source: 'https://github.com/adityashukla55/StockScanner',
};

/* ------------------------------------------------------------------ */

const configured = (url) => url && !url.includes('YOUR_');

// Before review passes there is no add-on link to give, but removing the main
// call to action leaves the hero looking broken. Saying so beats both a dead
// link and a hole.
const PENDING = { addon: 'Coming to Firefox' };

// querySelectorAll, not querySelector: the add-on link appears twice, in the
// header and in the hero. Handling only the first left the other a dead '#'.
for (const [key, url] of Object.entries(LINKS)) {
  const elements = document.querySelectorAll('[data-link="' + key + '"]');

  for (const el of elements) {
    if (configured(url)) {
      el.href = url;
      if (key !== 'sponsor') {
        el.target = '_blank';
        el.rel = 'noreferrer noopener';
      }
      continue;
    }

    // An inline link inside a sentence cannot simply vanish — removing it would
    // take its words with it and leave the sentence broken. Unwrap to plain text
    // instead, so the claim still reads even with nowhere to point.
    if (el.hasAttribute('data-keep')) {
      el.replaceWith(document.createTextNode(el.textContent));
      continue;
    }

    if (PENDING[key]) {
      const chip = document.createElement('span');
      // Keep whatever size the original was styled at.
      chip.className = el.className.replace('primary', '').trim() + ' pending';
      chip.textContent = PENDING[key];
      el.replaceWith(chip);
    } else {
      el.remove();
    }
  }
}

/**
 * The hero image, with a drawn fallback.
 *
 * A real screenshot is better than an illustration, but a broken image is worse
 * than either. Drop a screenshot at public/screenshot.png and the page uses it;
 * until then this stands in, and looks like a drawing rather than pretending to
 * be a product shot.
 */
function illustration() {
  const rows = [0, 1, 2, 3, 4, 5]
    .map(
      (i) =>
        '<rect class="bar" x="32" y="' + (90 + i * 48) + '" width="52" height="9" rx="4"/>' +
        '<rect class="tick" x="32" y="' + (104 + i * 48) + '" width="96" height="6" rx="3"/>' +
        '<rect class="bar" x="140" y="' + (92 + i * 48) + '" width="32" height="8" rx="4" opacity="0.5"/>',
    )
    .join('');

  const tabs = [0, 1, 2, 3, 4]
    .map(
      (i) =>
        '<rect class="bar" x="' + (218 + i * 52) + '" y="88" width="40" height="10" rx="5" opacity="' +
        (i === 3 ? 1 : 0.45) + '"/>',
    )
    .join('');

  const axis = [0, 1, 2, 3]
    .map((i) => '<rect class="tick" x="' + (220 + i * 98) + '" y="358" width="58" height="6" rx="3"/>')
    .join('');

  const path = 'M220 300 L262 268 L300 282 L344 214 L386 236 L430 176 L474 198 L516 148 L560 160 L600 120';

  const svg =
    '<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of the dashboard layout">' +
    '<style>' +
    '.panel { fill: var(--bg); stroke: var(--line); stroke-width: 1; }' +
    '.bar { fill: var(--line); }' +
    '.line { fill: none; stroke: var(--up); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }' +
    '.area { fill: var(--up); opacity: 0.09; }' +
    '.tick { fill: var(--muted); opacity: 0.55; }' +
    '</style>' +
    '<rect x="0" y="0" width="640" height="400" fill="var(--panel)"/>' +
    '<rect class="panel" x="16" y="16" width="608" height="40" rx="8"/>' +
    '<rect class="bar" x="30" y="32" width="96" height="8" rx="4"/>' +
    '<rect class="bar" x="470" y="32" width="140" height="8" rx="4" opacity="0.6"/>' +
    '<rect class="panel" x="16" y="70" width="170" height="314" rx="8"/>' +
    rows +
    '<rect class="panel" x="200" y="70" width="424" height="314" rx="8"/>' +
    tabs +
    '<path class="area" d="' + path + ' L600 340 L220 340 Z"/>' +
    '<path class="line" d="' + path + '"/>' +
    '<circle cx="600" cy="120" r="5" fill="var(--up)"/>' +
    axis +
    '</svg>';

  const wrapper = document.createElement('div');
  wrapper.innerHTML = svg;
  return wrapper.firstElementChild;
}

const shot = document.getElementById('shot');
if (shot) {
  // Show the drawing immediately; a real screenshot swaps in if one exists.
  shot.replaceChildren(illustration());

  const img = new Image();
  img.alt = 'The Stock Scanner dashboard';
  img.onload = () => shot.replaceChildren(img);
  img.src = 'screenshot.png';
}

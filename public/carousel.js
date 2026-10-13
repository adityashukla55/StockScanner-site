/**
 * The screenshot tour.
 *
 * Built on a scroll-snap strip rather than a transform carousel, so a touch
 * swipe is handled by the browser itself and the arrows and tabs are only
 * driving `scrollTo`. That keeps momentum, rubber-banding and trackpad gestures
 * all behaving the way the platform does, which no amount of JavaScript imitates
 * convincingly.
 *
 * Every shot is a real capture of the running extension, not a mockup.
 */
const SHOTS = [
  {
    tab: 'Detail',
    file: 'shots/shot-detail.png',
    caption:
      'A watchlist spanning four currencies — dollars, euros, rupees and London’s pence — with candles from two minutes to twenty years.',
  },
  {
    tab: 'Groups',
    file: 'shots/shot-groups.png',
    caption:
      'Sort your tickers into groups — a country, a currency, a theme — and every tab shows just that group. Fill one in a click by country or currency.',
  },
  {
    tab: 'Compare',
    file: 'shots/shot-compare.png',
    caption:
      'Up to eight tickers indexed to 0% at the start of the range, so you read relative performance rather than unrelated share prices.',
  },
  {
    tab: 'Portfolio',
    file: 'shots/shot-portfolio.png',
    caption:
      'Enter what your broker shows — amount invested, fee, price per share — and the shares and gain are worked out. Each currency is totalled on its own.',
  },
  {
    tab: 'Projection',
    file: 'shots/shot-projection.png',
    caption:
      'A lognormal model fitted to the ticker’s own history, drawn as percentile bands — a spread of possibilities, not a forecast.',
  },
  {
    tab: 'Allocation',
    file: 'shots/shot-allocation.png',
    caption:
      'Split a sum across your picks and see what it could become, as a total and as a yearly rate — a description of history, not a recommendation.',
  },
  {
    tab: 'Backup',
    file: 'shots/shot-backup.png',
    caption:
      'Moving to a new computer? Save your setup as a file or copy it as text, then load it there. Nothing is uploaded anywhere.',
  },
];

const slides = document.getElementById('slides');
const tabs = document.getElementById('tabs');
const caption = document.getElementById('caption');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

if (slides && tabs && caption) {
  let index = 0;

  SHOTS.forEach((shot, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';

    const img = document.createElement('img');
    img.src = shot.file;
    img.alt = `Stock Scanner: the ${shot.tab} view`;
    img.width = 1440;
    img.height = 880;
    // Only the first shot is worth blocking on; the rest arrive as needed.
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    slide.append(img);
    slides.append(slide);

    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.type = 'button';
    tab.role = 'tab';
    tab.textContent = shot.tab;
    tab.addEventListener('click', () => go(i));
    tabs.append(tab);
  });

  const paint = () => {
    [...tabs.children].forEach((tab, i) =>
      tab.setAttribute('aria-selected', String(i === index)),
    );
    caption.textContent = SHOTS[index].caption;
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === SHOTS.length - 1;
  };

  function go(to) {
    index = Math.max(0, Math.min(SHOTS.length - 1, to));
    slides.scrollTo({ left: index * slides.clientWidth, behavior: 'smooth' });
    paint();
  }

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));

  // Arrow keys work once the strip has focus, which is why it is tabbable.
  slides.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  });

  // A swipe moves the strip without going through go(), so the tabs follow the
  // scroll position rather than the other way round.
  let settle;
  slides.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const landed = Math.round(slides.scrollLeft / slides.clientWidth);
      if (landed !== index) {
        index = landed;
        paint();
      }
    }, 90);
  });

  // clientWidth changes with the window; keep the current slide aligned.
  addEventListener('resize', () => {
    slides.scrollTo({ left: index * slides.clientWidth, behavior: 'auto' });
  });

  paint();
}

/**
 * Fade sections in as they arrive.
 *
 * Purely decorative, so anything that cannot run it — an old browser, or a
 * reader who asked for reduced motion — simply sees the content already in
 * place. The CSS keeps `.reveal` visible in both those cases.
 */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        watcher.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -60px 0px' },
  );
  reveals.forEach((el) => watcher.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

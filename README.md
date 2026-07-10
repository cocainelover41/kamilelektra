# Kamil Elektra — Portfolio

Plain HTML/CSS/JS, no build step, no frameworks. Ready for GitHub Pages.

## Structure

```
index.html
css/style.css
js/main.js
assets/
  images/     Project photos & envelope (WebP where possible, PNG where transparency is needed)
  icons/      Social/platform icons (SVG where feasible, optimized PNG otherwise)
  fonts/      Self-hosted TeX Gyre Heros (see "Fonts" below)
```

## Preview locally

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```
(Opening `index.html` directly by double-clicking also works, since nothing here needs a server — but a local server is closer to how GitHub Pages will actually serve it.)

## Deploy to GitHub Pages

1. Create a repo, e.g. `portfolio`.
2. Push these files to the repo root:
   ```bash
   git init
   git add .
   git commit -m "initial site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. **Settings → Pages → Source → Deploy from a branch → main / (root)** → Save.
4. Live at `https://<you>.github.io/<repo>/` shortly after.

## Fonts

Body copy uses **TeX Gyre Heros** (the closest free, redistribution-safe Helvetica match), self-hosted as WOFF2 — I subset it down to Latin + punctuation, so it went from 133KB → 30KB per weight. Fallback stack: real Helvetica (if the visitor has it, e.g. any Mac) → **Inter** (loaded via Google Fonts, in case the WOFF2 fails to load for any reason) → Arial → sans-serif. You don't need to do anything else here; it's fully wired up and working.

## What I built exactly per your spec

- **Header**: sticky at the top of every section (not `position: fixed` — `sticky` gets the same visual result without needing to hand-manage a scroll offset), no bottom border, cuts off cleanly. Nav jumps to sections via plain anchors (no smooth-scroll, per "no animations").
- **PHASE grid**: logo + tag stacked flush on the left, catalog image spans the full height on the right, all touching with no gaps (CSS Grid, `object-fit: cover` handles the cropping you described).
- **Shirt**: clickable (image or "View" text — it's one `<button>` wrapping both, so either click works), opens a full preview.
- **Hoodie**: static, desaturated + dimmed via CSS (`grayscale` + reduced opacity) rather than a pre-edited image file — so the original color file is preserved if you ever want it elsewhere.
- **Discotheque row**: flush, no gap, matching your description.
- **Bag / sketch row**: kept the gap and the natural (uncropped) proportions, since you said you were neutral on it.
- **Lightbox**: native `<dialog>` element — every project photo opens a full-size preview in place, closes via the × button, click-outside, or **Esc** (built into `<dialog>`, no extra code needed). No transitions/animations anywhere, per your instruction.
- **Contact**: email is real selectable/copyable text (not part of the image), wrapped in a `mailto:` link. All social + platform icons open their real links in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **Code rules**: no inline CSS/JS, no framework, no `!important`, CSS variables throughout, semantic HTML (`header`, `nav`, `main`, `section`, `article`), only 5 IDs total and each is functional (3 anchor targets + 2 JS hooks) — nothing random.
- **Alignment fixes**: all three section dividers ("1 VISUAL ARTWORK", "2 ABOUT", "3 CONTACT") now share one CSS pattern (flex row, rule fills remaining space), so they're guaranteed to line up consistently instead of being positioned by hand per-section.

## Things I guessed at — please check these

1. **`CONCEPT_ALT.png` vs `FEST.png` placement**: I placed them left (pink "Open Stage") / right (blue "Discotheque×3") to match your screenshot, but had no way to confirm which filename is which from content alone. If it's backwards, swap the two `src`/`data-lightbox` values in the second `<article>` in `index.html`.
2. **Instagram icon**: no file was provided for this one, so I drew a simple monochrome outline glyph (`assets/icons/instagram_logo.svg`) to match the style of your X/TikTok icons. Swap it out if you'd rather use something specific.
3. **`hoodie_example_1.png`**: not used anywhere — your instructions specifically named `hoodie_example_2.png` for the small thumbnail, so that's what's wired up. Let me know if `_1` was meant to go somewhere.
4. **Header logo overlay position**: `plastic_bag.png` is positioned over the wordmark by eye (percentage-based offset), not from exact pixel measurements — close to your reference but worth a glance.
5. **Email position over the envelope**: same deal — measured from the screenshot, but it's an approximation. It's positioned as one absolute-positioned block relative to the envelope image, so nudging it in `style.css` (`.contact-card__email`) is a one-line change (`top` / `left`).
6. **About paragraph indent**: I noticed the body text sits indented further right than the section headings and the images — I kept that as-is since it read as a deliberate typographic choice, not a mistake, but flagging it in case it wasn't intentional.

## Performance

Total page weight (all images + both font weights) is under 900KB. Every image is lazy-loaded below the fold, sized with explicit `width`/`height` to avoid layout shift, and compressed (WebP for opaque photos, PNG only where transparency is actually used, exactly per your rules).

## Validation

Ran this through the real W3C-based html5validator: zero errors. (One informational note that `<dialog>` isn't supported in *all* browsers — it's been standard in Chrome/Firefox/Safari/Edge since 2022, so this only matters if you need to support very old browsers, which I'm assuming you don't.)

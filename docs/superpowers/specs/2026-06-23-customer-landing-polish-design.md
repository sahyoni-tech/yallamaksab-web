# Yalla Maksab — Customer Landing Polish (Design)

Date: 2026-06-23
Status: Approved (design)
Scope: customer-facing landing page only (`src/components/landing/*`, `src/brand.css`,
`src/content/strings.ts`, `index.html`, `public/`). No admin/auth changes.

## Goal

Turn the current bare landing (plain text bullet lists, inline styles, no product
visuals) into a polished, screenshot-forward marketing page that makes a good first
impression on customers. Arabic RTL, brand-consistent (cream + coral, Tajawal).

## Decisions (locked)

- **Ambition:** Polished marketing page.
- **Build approach:** Dependency-free — hand-written CSS + CSS animations only. No CSS
  framework, no motion library. Keep the lean landing bundle (admin stays code-split).
- **Audience:** Equal weight — shoppers and shops both get a full feature row.
- **Layout direction:** App-store showcase — hero with one phone + CTA, then alternating
  screenshot ↔ text feature rows.
- **Phone visuals:** Real in-app screenshots, provided by the founder. Build phone-mockup
  slots sized for them; ship placeholders until the PNGs land.
- **Language:** Arabic-only (no English toggle).
- **No fake stats / numbers.**

## Architecture

### Why CSS classes (not inline styles)

Every section is styled inline today. A polished page needs media queries, hover states,
and keyframe animation — none of which work as inline styles. Therefore styling moves
into CSS classes. This is a targeted improvement justified by the work, not a drive-by
refactor.

### Files

- `src/brand.css` — expand into a small design system: tokens, section/component classes,
  animations, media queries. Single stylesheet (no CSS modules — keeps the vanilla stack).
- `src/components/landing/` — rewrite each section to use classes; add new primitives.
- `src/content/strings.ts` — extend the single `ar` object with new copy.
- `index.html` — add Tajawal 800 weight; preconnect already present.
- `public/screens/` — screenshot slots (placeholder images until real ones provided).
- `src/pages/Landing.tsx` — compose new section order (add Header + ValueStrip).
- `src/pages/Landing.test.tsx` — extend assertions.

### New reusable components (`src/components/landing/`)

- `Header.tsx` — sticky top bar: app icon + brand wordmark + download button. Gains a
  shadow after scroll.
- `PhoneMockup.tsx` — pure-CSS device frame (rounded body, notch, drop shadow) wrapping a
  screenshot `<img>`. Props: `src`, `alt`. Fixed aspect ratio so layout is stable before
  the image loads.
- `FeatureRow.tsx` — one feature block: screenshot on one side, heading + icon bullet list
  (+ optional CTA) on the other. Prop `side: "start" | "end"` flips order for alternation.
- `ValueStrip.tsx` — three icon chips (`قريب منك • مجاني • فوري`).
- `Icon.tsx` — small inline-SVG set (no icon dependency). Icons needed: location/pin,
  heart/follow, bookmark/save, megaphone/post, users/reach, bell/notify, download,
  telegram, whatsapp, mail, check, chevron.
- `useReveal.ts` (hook in `src/hooks/`) — wraps `IntersectionObserver`, returns a ref +
  toggles a `.is-visible` class when the element scrolls into view. No dependency.

## Visual system (tokens in brand.css)

Extend `:root`:

- Keep: `--coral #C44C24`, `--on-coral`, `--bg #F1EFE8`, `--fg #1A1A1A`, `--muted #6B655C`,
  `--card #FFFFFF`, `--border #E2DED3`.
- Add: `--tint #FBF2EC` (soft coral band), `--dark #1A1A1A` + `--on-dark #F1EFE8`
  (download anchor band), shadow tokens (`--shadow-sm/md/lg`), radius tokens
  (`--r-sm 12px`, `--r-md 16px`, `--r-lg 22px`), container widths (`--maxw 1080px`,
  `--maxw-text 720px`).
- Coral is reserved for CTAs / urgency only (existing rule) — keep it.

Typography:

- Fluid headings with `clamp()`: hero `clamp(30px, 6vw, 48px)`, section `clamp(22px, 4vw, 32px)`.
- Add Tajawal `800` weight in `index.html` for hero/section headings.

## Sections (top → bottom, RTL)

1. **Sticky header (new)** — `[app icon] يلا مكسب  …………  [حمّل التطبيق]`. Transparent at
   top, solid + shadow after a small scroll. Download button scrolls to `#download`.
2. **Hero** — two columns on desktop, stacked on mobile.
   - Content side: app icon tile (existing rounded-tile treatment), brand name, big
     tagline (`عروض بالقرب منك`), pitch, primary CTA (`حمّل التطبيق`), `أندرويد` chip,
     `قريباً Play` note.
   - Visual side: `PhoneMockup` with the deals-feed screenshot. Gentle float + fade-up
     entrance. Soft coral radial glow behind the phone.
3. **Value strip** — three icon chips: `قريب منك • مجاني • فوري`. Light band. No numbers.
4. **للزبائن** — `FeatureRow` (`side="start"`). Three points, each an `Icon` + short
   one-line description (expand copy beyond the current 3 bare bullets). Deals/saved
   screenshot.
5. **للمتاجر** — `FeatureRow` (`side="end"`, alternates). Three points + `سجّل متجرك` CTA.
   Shop dashboard / post-deal screenshot.
6. **كيف يعمل** — three numbered step cards in a row with coral numerals and a connecting
   line: `1 حمّل  ›  2 تصفّح  ›  3 استفد`. Stacks vertically on mobile.
7. **التحميل (dark band)** — `--dark` background for contrast. Strong CTA, `androidNote`,
   `sideloadNote`, `قريباً Play`. **QR code** (`store-assets/download-qr.png`, copied into
   `public/`) shown on desktop for scan-to-download. SHA-256 moved into a collapsible
   `<details>` labeled `بصمة الملف` — kept for verification, no longer clutters.
8. **تواصل معنا** — card with icon buttons: Telegram, WhatsApp, email. Real handles needed
   from founder; email `hello@yallamaksab.com` placeholder for the others until supplied.
9. **Footer** — brand mark, privacy/terms links, `© يلا مكسب`. Clean layout (not the
   current link-as-button styling).

## Motion (CSS only)

- `useReveal` + `.reveal`/`.is-visible` classes: fade + slide-up as sections enter view.
- Hero phone gentle float (CSS keyframes).
- Button hover-lift; header shadow on scroll.
- All motion wrapped in `@media (prefers-reduced-motion: no-preference)` so reduced-motion
  users get a static page.

## Responsive

Mobile-first. Feature rows and hero stack under ~768px. `clamp()` type scales. Phone
mockup max-width scales with viewport. Touch-friendly tap targets on CTAs.

## Copy (strings.ts additions)

Single `ar` object stays the source of truth. Add:

- `navDownload` (header button), value-strip labels, per-feature short descriptions for
  shoppers + shops (one line each), step descriptions for `كيف يعمل`, contact channel
  labels (Telegram/WhatsApp/email), `qrHint` ("امسح للتحميل").

## Assets needed from founder

1. **Real screenshots** (portrait, drop in `public/screens/`):
   - `hero` — deals feed (home).
   - `shoppers` — saved deals / following a shop.
   - `shops` — shop dashboard / post-a-deal.
   Placeholder images ship until these arrive; swapping is a file drop, no code change.
2. **Wordmark** — confirm the dark-text-on-transparent variant for the header
   (`yalla-maksab-ar.png` candidate). Fallback: app icon + Tajawal text.
3. **Contact handles** — Telegram + WhatsApp.

## Testing / quality gates

- Extend `src/pages/Landing.test.tsx`: assert hero CTA text, each section heading,
  download link `href` (the APK URL), and screenshot `alt` text present.
- `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all green.
- Confirm no new runtime dependency added; landing chunk stays lean (admin still split).
- Accessibility: `alt` on all screenshots, coral-on-cream / coral-on-dark contrast checked,
  `prefers-reduced-motion` honored, header is a real `<header>`/`<nav>`.

## Out of scope

- English / i18n toggle.
- Fake stats or testimonials.
- Admin, auth, or Supabase changes.
- CSS framework or motion library.
- Backend / shop-signup flow changes (CTAs link to download / existing in-app flow).

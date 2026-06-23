# Customer Landing Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the bare Yalla Maksab landing into a polished, screenshot-forward Arabic marketing page (sticky header, hero with phone mockup, alternating feature rows, step cards, dark download band, contact channels).

**Architecture:** Move styling from inline styles into a single expanded `src/brand.css` design system. Keep one component per section; add small reusable primitives (`Icon`, `PhoneMockup`, `FeatureRow`, `ValueStrip`, `Header`) and a `useReveal` scroll hook. Real screenshots ship as file-drop placeholders. Pure CSS + CSS animations only — no new dependencies.

**Tech Stack:** Vite + React 19 + TypeScript, vitest + @testing-library/react (jsdom), hand-written CSS. Existing: react-router-dom, @supabase/supabase-js (admin only, code-split).

## Global Constraints

- Arabic-only, RTL (`<html dir="rtl">`); use CSS logical properties (`margin-inline`, `padding-block`, `start/end`) — never `left/right`.
- No new runtime dependencies. No CSS framework, no motion library.
- Coral `#C44C24` is reserved for CTAs / urgency only.
- No fake stats, numbers, or testimonials.
- Admin stays code-split; nothing in `src/components/admin`, `src/pages/Admin.tsx`, `src/lib/`, or `src/hooks/useSession.ts` changes.
- All motion gated behind `@media (prefers-reduced-motion: no-preference)`.
- Real screenshots are file-drop swaps in `public/screens/` — no code change to replace them.
- Test files import `it`/`expect` explicitly from `vitest` (match existing `Landing.test.tsx`).
- Quality gates (run before final commit): `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` all green.
- Work happens on branch `landing-polish` (already created).

---

## File map

Create:
- `src/components/landing/Icon.tsx` — inline-SVG icon set.
- `src/components/landing/PhoneMockup.tsx` — CSS device frame wrapping a screenshot.
- `src/components/landing/FeatureRow.tsx` — alternating screenshot↔text feature block.
- `src/components/landing/ValueStrip.tsx` — three value chips.
- `src/components/landing/Header.tsx` — sticky top nav.
- `src/hooks/useReveal.ts` — IntersectionObserver scroll-reveal hook (graceful fallback).
- Test files alongside each (`*.test.tsx` / `*.test.ts`).
- `public/screens/{hero,shoppers,shops}.png`, `public/qr-download.png` (placeholder assets).

Modify:
- `src/brand.css` — full design-system rewrite (Task 1) + per-component CSS appended.
- `src/content/strings.ts` — add copy keys.
- `index.html` — add Tajawal 800 weight.
- `src/components/landing/{Hero,ForShoppers,ForShops,HowItWorks,Download,Contact,Footer}.tsx` — rewrite to use classes/primitives.
- `src/pages/Landing.tsx` — compose new section order (add Header + ValueStrip).
- `src/pages/Landing.test.tsx` — extend integration assertions.

---

### Task 1: Foundation — tokens, fonts, assets, copy

**Files:**
- Modify: `src/brand.css` (full rewrite)
- Modify: `index.html` (font weight)
- Modify: `src/content/strings.ts` (add public-facing keys; keep all admin keys)
- Create: `public/screens/hero.png`, `public/screens/shoppers.png`, `public/screens/shops.png`, `public/qr-download.png`
- Test: `src/content/strings.test.ts`

**Interfaces:**
- Produces: CSS tokens/utility classes (`.section`, `.container`, `.band-tint`, `.band-dark`, `.btn-primary`, `.btn-secondary`, `.chip`, `.eyebrow`, `.h2`, `.lead`, `.icon`, `.reveal`/`.is-visible`, `@keyframes float`); the expanded `ar` strings object; placeholder image paths `/screens/hero.png`, `/screens/shoppers.png`, `/screens/shops.png`, `/qr-download.png`.

- [ ] **Step 1: Write the failing test**

Create `src/content/strings.test.ts`:

```ts
import { it, expect } from "vitest";
import { ar } from "./strings";

it("aligns each description array with its point/step array", () => {
  expect(ar.shoppersDesc.length).toBe(ar.shoppersPoints.length);
  expect(ar.shopsDesc.length).toBe(ar.shopsPoints.length);
  expect(ar.howDesc.length).toBe(ar.howSteps.length);
});

it("has the new hero, nav and value-strip copy", () => {
  expect(ar.navDownload).toBeTruthy();
  expect(ar.androidChip).toBeTruthy();
  expect(ar.heroShot).toBeTruthy();
  expect(ar.valueNear).toBeTruthy();
  expect(ar.qrHint).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/strings.test.ts`
Expected: FAIL — `ar.shoppersDesc` is undefined / properties missing.

- [ ] **Step 3: Rewrite `src/content/strings.ts`**

Replace the file with (existing admin keys preserved verbatim at the bottom):

```ts
export const ar = {
  brand: "يلا مكسب",
  tagline: "عروض بالقرب منك",
  heroPitch: "اكتشف صفقات المتاجر القريبة منك، تابع متاجرك المفضّلة، واحفظ العروض قبل أن تنتهي.",
  heroShot: "لقطة من تطبيق يلا مكسب — قائمة العروض القريبة",
  downloadCta: "حمّل التطبيق",
  navDownload: "حمّل التطبيق",
  androidChip: "متاح على أندرويد",
  // value strip
  valueNear: "قريب منك",
  valueFree: "مجاني",
  valueInstant: "فوري",
  // shoppers
  shoppersTitle: "للزبائن",
  shoppersHeadline: "كل عروض جيرانك بمكان واحد",
  shoppersPoints: ["عروض قريبة منك", "تابع متاجرك المفضّلة", "احفظ العروض وعُد إليها"],
  shoppersDesc: [
    "شوف صفقات المتاجر حولك مرتّبة حسب المسافة.",
    "تابع متاجرك وتوصلك عروضها الجديدة أول بأول.",
    "احفظ العرض اللي عجبك وارجع له قبل أن ينتهي.",
  ],
  shoppersShot: "لقطة من التطبيق — العروض المحفوظة والمتاجر المتابَعة",
  // shops
  shopsTitle: "للمتاجر",
  shopsHeadline: "خلّي زبائن منطقتك يشوفونك",
  shopsPoints: ["انشر عروضك مجاناً", "وصول للزبائن في منطقتك", "تنبيه فوري لمتابعيك"],
  shopsDesc: [
    "أضف عرضك بصورة وسعر بدقائق، بدون أي رسوم.",
    "زبائن منطقتك يشوفون متجرك وهم يتصفّحون العروض القريبة.",
    "كل عرض جديد يصل متابعينك بإشعار فوري.",
  ],
  shopsShot: "لقطة من التطبيق — لوحة المتجر ونشر عرض جديد",
  shopsCta: "سجّل متجرك",
  // how it works
  howTitle: "كيف يعمل",
  howSteps: ["حمّل التطبيق", "تصفّح العروض حولك", "تابع، احفظ، واستفد"],
  howDesc: [
    "نزّل التطبيق على أندرويد بضغطة واحدة.",
    "افتح الخريطة وشوف العروض الأقرب لك.",
    "تابع متاجرك، احفظ العروض، واستفد قبل أن تنتهي.",
  ],
  // download
  downloadTitle: "حمّل التطبيق",
  androidNote: "متاح حالياً على أندرويد فقط.",
  sideloadNote: "بعد التحميل، اسمح بالتثبيت من «مصدر غير معروف» لإكمال التثبيت.",
  playSoon: "قريباً على Google Play",
  qrHint: "امسح للتحميل",
  checksumLabel: "بصمة الملف (SHA-256):",
  // contact
  contactTitle: "تواصل معنا",
  contactTelegram: "تيليغرام",
  contactWhatsapp: "واتساب",
  // footer
  privacy: "سياسة الخصوصية",
  terms: "شروط الاستخدام",
  rights: "© يلا مكسب",
  // admin
  adminTitle: "لوحة الإدارة",
  adminEmailLabel: "البريد الإلكتروني",
  adminSendLink: "أرسل رابط الدخول",
  adminLinkSent: "تفقّد بريدك — أرسلنا رابط الدخول.",
  adminNotAuthorized: "هذا الحساب ليس مخوّلاً للدخول إلى لوحة الإدارة.",
  adminPendingTitle: "متاجر بانتظار الموافقة",
  adminEmpty: "لا توجد متاجر بانتظار الموافقة.",
  adminApprove: "موافقة",
  adminReject: "رفض",
  adminSignOut: "تسجيل الخروج",
  adminError: "حدث خطأ، حاول مرة أخرى.",
  adminFeedbackTab: "الملاحظات",
  adminPendingTab: "المتاجر",
  adminFeedbackTitle: "ملاحظات المستخدمين",
  adminFeedbackEmpty: "لا توجد ملاحظات.",
  adminFeedbackResolve: "تمّت المعالجة",
  adminFeedbackReopen: "إعادة فتح",
  adminFeedbackResolved: "معالَجة",
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/strings.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Rewrite `src/brand.css`**

Replace the entire file with:

```css
:root {
  /* color */
  --coral: #C44C24;        /* CTAs / urgency ONLY */
  --coral-dark: #A63D1C;
  --on-coral: #FFFFFF;
  --bg: #F1EFE8;
  --tint: #FBF2EC;
  --dark: #1A1A1A;
  --on-dark: #F1EFE8;
  --fg: #1A1A1A;
  --muted: #6B655C;
  --card: #FFFFFF;
  --border: #E2DED3;
  /* layout */
  --maxw: 1080px;
  --maxw-text: 720px;
  /* radius */
  --r-sm: 12px;
  --r-md: 16px;
  --r-lg: 22px;
  /* shadow */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.10);
  --shadow-lg: 0 18px 50px rgba(0,0,0,0.16);
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--fg);
  font-family: "Tajawal", system-ui, "Segoe UI", Tahoma, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { line-height: 1.25; font-weight: 800; margin: 0; }
p { margin: 0; }
ul, ol { margin: 0; padding: 0; list-style: none; }

.container { max-width: var(--maxw); margin-inline: auto; padding-inline: 20px; }
.section { padding-block: clamp(40px, 8vw, 88px); }
.band-tint { background: var(--tint); }
.band-dark { background: var(--dark); color: var(--on-dark); }
.eyebrow { color: var(--coral); font-weight: 700; letter-spacing: .02em; margin: 0; }
.h2 { font-size: clamp(22px, 4vw, 32px); }
.lead { color: var(--muted); font-size: clamp(15px, 2.2vw, 18px); }
.band-dark .lead { color: #C9C4BA; }

/* buttons */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--coral); color: var(--on-coral);
  padding: 14px 28px; border-radius: var(--r-sm); font-weight: 700;
  text-decoration: none; border: none; cursor: pointer; font-size: 16px;
  transition: background .15s ease;
}
.btn-primary:hover { background: var(--coral-dark); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: var(--fg);
  padding: 12px 24px; border-radius: var(--r-sm); border: 1px solid var(--border);
  text-decoration: none; font-weight: 600; cursor: pointer;
  transition: border-color .15s ease;
}
.btn-secondary:hover { border-color: var(--coral); }
.band-dark .btn-secondary { color: var(--on-dark); border-color: rgba(255,255,255,.25); }

/* chip */
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 999px; padding: 6px 14px; font-size: 14px; color: var(--muted);
}
.chip svg { width: 16px; height: 16px; color: var(--coral); }

/* icon default size */
.icon { width: 24px; height: 24px; display: inline-block; vertical-align: middle; }

/* reveal-on-scroll (static unless motion is allowed) */
.reveal { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .reveal { opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease; }
  .reveal.is-visible { opacity: 1; transform: none; }
  .btn-primary, .btn-secondary { transition: background .15s ease, border-color .15s ease, transform .15s ease, box-shadow .15s ease; }
  .btn-primary:hover, .btn-secondary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
}
/* RTL is set on <html dir="rtl">; use logical properties only (margin-inline, etc.) */
```

- [ ] **Step 6: Add the 800 weight in `index.html`**

Change the Tajawal `<link href=...>` from `wght@400;500;700` to include `800`:

```html
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
```

- [ ] **Step 7: Copy placeholder assets into `public/`**

Run:

```bash
mkdir -p public/screens
cp "/Users/home/Downloads/screen.png" public/screens/hero.png
cp "/Users/home/Downloads/screen 2.png" public/screens/shoppers.png
cp "/Users/home/Downloads/screen.png" public/screens/shops.png
cp "/Users/home/Downloads/MAKSAB/store-assets/download-qr.png" public/qr-download.png
ls -la public/screens public/qr-download.png
```

Expected: four files present (`hero.png`, `shoppers.png`, `shops.png`, `qr-download.png`).

- [ ] **Step 8: Verify build + typecheck**

Run: `npm run typecheck && npm run build`
Expected: both succeed (no type errors, build emits `dist/`).

- [ ] **Step 9: Commit**

```bash
git add src/brand.css src/content/strings.ts src/content/strings.test.ts index.html public/screens public/qr-download.png
git commit -m "feat(landing): design tokens, copy, fonts and placeholder assets"
```

---

### Task 2: Icon primitive

**Files:**
- Create: `src/components/landing/Icon.tsx`
- Test: `src/components/landing/Icon.test.tsx`

**Interfaces:**
- Produces: `Icon` component and `IconName` type. `IconName = "pin" | "heart" | "bookmark" | "megaphone" | "users" | "bell" | "download" | "telegram" | "whatsapp" | "mail" | "check" | "tag" | "bolt"`. Usage: `<Icon name="pin" className?="..." />` → inline `<svg class="icon" data-icon="pin" ...>`.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Icon.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

it("renders an svg tagged with the icon name", () => {
  const { container } = render(<Icon name="download" />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("data-icon")).toBe("download");
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/Icon.test.tsx`
Expected: FAIL — cannot find module `./Icon`.

- [ ] **Step 3: Create `src/components/landing/Icon.tsx`**

```tsx
import { type ReactNode } from "react";

export type IconName =
  | "pin" | "heart" | "bookmark" | "megaphone" | "users" | "bell"
  | "download" | "telegram" | "whatsapp" | "mail" | "check" | "tag" | "bolt";

const paths: Record<IconName, ReactNode> = {
  pin: (<><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  bookmark: <path d="M6 4h12v16l-6-4-6 4z" />,
  megaphone: (<><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M16 8a5 5 0 0 1 0 8" /></>),
  users: (<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6" /><path d="M18 20a6 6 0 0 0-3-5" /></>),
  bell: (<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></>),
  download: (<><path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M5 21h14" /></>),
  telegram: <path d="M21 4L3 11l5 2 2 6 3-4 5 4z" />,
  whatsapp: (<><path d="M4 20l1.4-4A8 8 0 1 1 8.8 19.4z" /><path d="M9 10c0 3 2 5 5 5" /></>),
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  check: <path d="M4 12l5 5 11-11" />,
  tag: (<><path d="M20 4h-7l-9 9 7 7 9-9z" /><circle cx="15" cy="9" r="1.4" /></>),
  bolt: <path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      data-icon={name}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/landing/Icon.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Icon.tsx src/components/landing/Icon.test.tsx
git commit -m "feat(landing): inline-svg Icon primitive"
```

---

### Task 3: PhoneMockup primitive

**Files:**
- Create: `src/components/landing/PhoneMockup.tsx`
- Modify: `src/brand.css` (append phone styles)
- Test: `src/components/landing/PhoneMockup.test.tsx`

**Interfaces:**
- Consumes: `.phone` CSS from this task.
- Produces: `PhoneMockup` component. Usage: `<PhoneMockup src="/screens/hero.png" alt="..." className?="..." />` → `<div class="phone"><div class="phone-screen"><span class="phone-notch"/><img .../></div></div>`.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/PhoneMockup.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhoneMockup } from "./PhoneMockup";

it("renders the screenshot with its alt text and src", () => {
  render(<PhoneMockup src="/screens/hero.png" alt="لقطة" />);
  const img = screen.getByRole("img", { name: "لقطة" });
  expect(img).toHaveAttribute("src", "/screens/hero.png");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/PhoneMockup.test.tsx`
Expected: FAIL — cannot find module `./PhoneMockup`.

- [ ] **Step 3: Create `src/components/landing/PhoneMockup.tsx`**

```tsx
type Props = { src: string; alt: string; className?: string };

export function PhoneMockup({ src, alt, className }: Props) {
  return (
    <div className={className ? `phone ${className}` : "phone"}>
      <div className="phone-screen">
        <span className="phone-notch" />
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Append phone styles to end of `src/brand.css`**

```css

/* --- Phone mockup --- */
.phone {
  width: min(280px, 72vw);
  background: #111;
  border-radius: 36px;
  padding: 10px;
  box-shadow: var(--shadow-lg);
}
.phone-screen {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  aspect-ratio: 9 / 16;
  background: var(--border);
}
.phone-screen img { width: 100%; height: 100%; object-fit: cover; display: block; }
.phone-notch {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  width: 38%; height: 18px; background: #111; border-radius: 0 0 12px 12px; z-index: 2;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/PhoneMockup.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/PhoneMockup.tsx src/components/landing/PhoneMockup.test.tsx src/brand.css
git commit -m "feat(landing): PhoneMockup device frame"
```

---

### Task 4: useReveal scroll hook

**Files:**
- Create: `src/hooks/useReveal.ts`
- Test: `src/hooks/useReveal.test.tsx`

**Interfaces:**
- Produces: `useReveal<T extends HTMLElement = HTMLDivElement>(): React.RefObject<T | null>`. Attach the returned ref to an element that also has the `reveal` class; the hook adds `is-visible` when it scrolls into view, or immediately when `IntersectionObserver` is unavailable.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useReveal.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useReveal } from "./useReveal";

function Probe() {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className="reveal" data-testid="r" />;
}

it("falls back to visible when IntersectionObserver is unavailable", () => {
  // jsdom provides no IntersectionObserver, so the hook takes its fallback path.
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("r").classList.contains("is-visible")).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useReveal.test.tsx`
Expected: FAIL — cannot find module `./useReveal`.

- [ ] **Step 3: Create `src/hooks/useReveal.ts`**

```ts
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useReveal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReveal.ts src/hooks/useReveal.test.tsx
git commit -m "feat(landing): useReveal scroll-reveal hook"
```

---

### Task 5: Sticky Header

**Files:**
- Create: `src/components/landing/Header.tsx`
- Modify: `src/brand.css` (append header styles)
- Test: `src/components/landing/Header.test.tsx`

**Interfaces:**
- Consumes: `ar.brand`, `ar.navDownload` (Task 1); `.btn-primary`, `.container` CSS.
- Produces: `Header` component (no props). Adds `is-scrolled` class to `<header class="site-header">` after `window.scrollY > 8`.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Header.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

it("shows the brand and a download link to #download", () => {
  render(<Header />);
  expect(screen.getByText("يلا مكسب")).toBeInTheDocument();
  const cta = screen.getByRole("link", { name: "حمّل التطبيق" });
  expect(cta).toHaveAttribute("href", "#download");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/Header.test.tsx`
Expected: FAIL — cannot find module `./Header`.

- [ ] **Step 3: Create `src/components/landing/Header.tsx`**

```tsx
import { useEffect, useState } from "react";
import { ar } from "../../content/strings";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="container site-header-row">
        <a className="site-brand" href="#top">
          <img src="/icon-192.png" alt="" width={32} height={32} />
          <span>{ar.brand}</span>
        </a>
        <a className="btn-primary site-header-cta" href="#download">{ar.navDownload}</a>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Append header styles to end of `src/brand.css`**

```css

/* --- Sticky header --- */
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: transparent;
  transition: background .2s ease, box-shadow .2s ease;
}
.site-header.is-scrolled {
  background: rgba(241, 239, 232, .9);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-sm);
}
.site-header-row {
  display: flex; align-items: center; justify-content: space-between;
  padding-block: 12px;
}
.site-brand {
  display: inline-flex; align-items: center; gap: 10px;
  font-weight: 800; font-size: 18px; color: var(--fg); text-decoration: none;
}
.site-brand img { border-radius: 8px; }
.site-header-cta { padding: 10px 18px; font-size: 14px; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/Header.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Header.tsx src/components/landing/Header.test.tsx src/brand.css
git commit -m "feat(landing): sticky header with scroll shadow"
```

---

### Task 6: Hero rewrite

**Files:**
- Modify: `src/components/landing/Hero.tsx` (full rewrite)
- Modify: `src/brand.css` (append hero styles)
- Test: `src/components/landing/Hero.test.tsx`

**Interfaces:**
- Consumes: `PhoneMockup` (Task 3), `useReveal` (Task 4), `Icon` (Task 2), `ar` keys `brand/tagline/heroPitch/downloadCta/androidChip/playSoon/heroShot`.
- Produces: `Hero` rendered as `<section id="top" class="section">`; the deals screenshot uses `/screens/hero.png`.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Hero.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { ar } from "../../content/strings";

it("renders the tagline, the hero screenshot and a download CTA", () => {
  render(<Hero />);
  expect(screen.getByText("عروض بالقرب منك")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: ar.heroShot })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "حمّل التطبيق" })).toHaveAttribute("href", "#download");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/Hero.test.tsx`
Expected: FAIL — current Hero has no screenshot image / `#download` CTA shape differs (no img with that alt).

- [ ] **Step 3: Rewrite `src/components/landing/Hero.tsx`**

```tsx
import { ar } from "../../content/strings";
import { Icon } from "./Icon";
import { PhoneMockup } from "./PhoneMockup";
import { useReveal } from "../../hooks/useReveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="top" className="section">
      <div ref={ref} className="container hero reveal">
        <div className="hero-text">
          <img className="hero-icon" src="/icon-192.png" alt={ar.brand} width={72} height={72} />
          <div className="hero-brand">{ar.brand}</div>
          <h1 className="hero-title">{ar.tagline}</h1>
          <p className="hero-pitch">{ar.heroPitch}</p>
          <div className="hero-cta">
            <a className="btn-primary" href="#download">{ar.downloadCta}</a>
            <span className="chip"><Icon name="check" />{ar.androidChip}</span>
          </div>
          <p className="hero-note">{ar.playSoon}</p>
        </div>
        <div className="hero-visual">
          <PhoneMockup src="/screens/hero.png" alt={ar.heroShot} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Append hero styles to end of `src/brand.css`**

```css

/* --- Hero --- */
.hero { display: grid; gap: clamp(24px, 5vw, 56px); align-items: center; }
@media (min-width: 768px) { .hero { grid-template-columns: 1.1fr 0.9fr; } }
.hero-icon { width: 72px; height: 72px; border-radius: 18px; box-shadow: var(--shadow-md); }
.hero-brand { font-size: 26px; font-weight: 800; margin-top: 14px; }
.hero-title { font-size: clamp(30px, 6vw, 48px); margin: 6px 0 12px; }
.hero-pitch { color: var(--muted); font-size: clamp(16px, 2.6vw, 20px); max-width: 40ch; }
.hero-cta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 22px; }
.hero-note { color: var(--muted); font-size: 14px; margin-top: 12px; }
.hero-visual { position: relative; display: flex; justify-content: center; }
.hero-visual::before {
  content: ""; position: absolute; inset: 10% 12%;
  background: radial-gradient(closest-side, rgba(196,76,36,.22), transparent);
  filter: blur(22px); z-index: 0;
}
.hero-visual .phone { position: relative; z-index: 1; }
@media (prefers-reduced-motion: no-preference) {
  .hero-visual .phone { animation: float 6s ease-in-out infinite; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Hero.tsx src/components/landing/Hero.test.tsx src/brand.css
git commit -m "feat(landing): hero with phone mockup and CTA"
```

---

### Task 7: ValueStrip

**Files:**
- Create: `src/components/landing/ValueStrip.tsx`
- Modify: `src/brand.css` (append value-strip styles)
- Test: `src/components/landing/ValueStrip.test.tsx`

**Interfaces:**
- Consumes: `Icon` (Task 2), `ar` keys `valueNear/valueFree/valueInstant`.
- Produces: `ValueStrip` component (no props).

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/ValueStrip.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValueStrip } from "./ValueStrip";

it("renders the three value chips", () => {
  render(<ValueStrip />);
  expect(screen.getByText("قريب منك")).toBeInTheDocument();
  expect(screen.getByText("مجاني")).toBeInTheDocument();
  expect(screen.getByText("فوري")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/ValueStrip.test.tsx`
Expected: FAIL — cannot find module `./ValueStrip`.

- [ ] **Step 3: Create `src/components/landing/ValueStrip.tsx`**

```tsx
import { ar } from "../../content/strings";
import { Icon, type IconName } from "./Icon";

const items: { icon: IconName; text: string }[] = [
  { icon: "pin", text: ar.valueNear },
  { icon: "tag", text: ar.valueFree },
  { icon: "bolt", text: ar.valueInstant },
];

export function ValueStrip() {
  return (
    <div className="container value-strip">
      {items.map((i) => (
        <div className="value-chip" key={i.text}>
          <Icon name={i.icon} />
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Append value-strip styles to end of `src/brand.css`**

```css

/* --- Value strip --- */
.value-strip {
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
  padding-block: 4px clamp(8px, 4vw, 24px);
}
.value-chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 999px; padding: 10px 18px; font-weight: 600;
}
.value-chip svg { width: 18px; height: 18px; color: var(--coral); }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/ValueStrip.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/ValueStrip.tsx src/components/landing/ValueStrip.test.tsx src/brand.css
git commit -m "feat(landing): value-proposition chip strip"
```

---

### Task 8: FeatureRow + Shoppers/Shops rewrite

**Files:**
- Create: `src/components/landing/FeatureRow.tsx`
- Modify: `src/components/landing/ForShoppers.tsx` (full rewrite)
- Modify: `src/components/landing/ForShops.tsx` (full rewrite)
- Modify: `src/brand.css` (append feature-row styles)
- Test: `src/components/landing/FeatureRow.test.tsx`

**Interfaces:**
- Consumes: `Icon`/`IconName` (Task 2), `PhoneMockup` (Task 3), `useReveal` (Task 4), `ar` shoppers/shops keys.
- Produces: `FeatureRow` with props
  `{ eyebrow: string; title: string; points: { icon: IconName; text: string; desc: string }[]; image: { src: string; alt: string }; side: "start" | "end"; cta?: { href: string; label: string } }`.
  Root: `<section class="section"><div class="container feature reveal feature-${side}">...`. `ForShoppers`/`ForShops` render `FeatureRow`.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/FeatureRow.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureRow } from "./FeatureRow";

it("applies the side modifier class, renders the screenshot and the optional CTA", () => {
  const { container } = render(
    <FeatureRow
      eyebrow="للمتاجر"
      title="عنوان"
      side="end"
      points={[{ icon: "pin", text: "نقطة", desc: "وصف" }]}
      image={{ src: "/screens/shops.png", alt: "لقطة" }}
      cta={{ href: "#download", label: "سجّل متجرك" }}
    />
  );
  expect(container.querySelector(".feature-end")).not.toBeNull();
  expect(screen.getByRole("img", { name: "لقطة" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "سجّل متجرك" })).toHaveAttribute("href", "#download");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/FeatureRow.test.tsx`
Expected: FAIL — cannot find module `./FeatureRow`.

- [ ] **Step 3: Create `src/components/landing/FeatureRow.tsx`**

```tsx
import { Icon, type IconName } from "./Icon";
import { PhoneMockup } from "./PhoneMockup";
import { useReveal } from "../../hooks/useReveal";

type Point = { icon: IconName; text: string; desc: string };

type Props = {
  eyebrow: string;
  title: string;
  points: Point[];
  image: { src: string; alt: string };
  side: "start" | "end";
  cta?: { href: string; label: string };
};

export function FeatureRow({ eyebrow, title, points, image, side, cta }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section">
      <div ref={ref} className={`container feature reveal feature-${side}`}>
        <div className="feature-visual">
          <PhoneMockup src={image.src} alt={image.alt} />
        </div>
        <div className="feature-text">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">{title}</h2>
          <ul className="feature-points">
            {points.map((p) => (
              <li key={p.text}>
                <span className="feature-ic"><Icon name={p.icon} /></span>
                <span>
                  <strong>{p.text}</strong>
                  <span className="lead feature-desc">{p.desc}</span>
                </span>
              </li>
            ))}
          </ul>
          {cta && <a className="btn-secondary" href={cta.href}>{cta.label}</a>}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/landing/ForShoppers.tsx`**

```tsx
import { ar } from "../../content/strings";
import { FeatureRow } from "./FeatureRow";
import { type IconName } from "./Icon";

const icons: IconName[] = ["pin", "heart", "bookmark"];

export function ForShoppers() {
  const points = ar.shoppersPoints.map((text, i) => ({
    icon: icons[i],
    text,
    desc: ar.shoppersDesc[i],
  }));
  return (
    <FeatureRow
      eyebrow={ar.shoppersTitle}
      title={ar.shoppersHeadline}
      points={points}
      image={{ src: "/screens/shoppers.png", alt: ar.shoppersShot }}
      side="start"
    />
  );
}
```

- [ ] **Step 5: Rewrite `src/components/landing/ForShops.tsx`**

```tsx
import { ar } from "../../content/strings";
import { FeatureRow } from "./FeatureRow";
import { type IconName } from "./Icon";

const icons: IconName[] = ["megaphone", "users", "bell"];

export function ForShops() {
  const points = ar.shopsPoints.map((text, i) => ({
    icon: icons[i],
    text,
    desc: ar.shopsDesc[i],
  }));
  return (
    <FeatureRow
      eyebrow={ar.shopsTitle}
      title={ar.shopsHeadline}
      points={points}
      image={{ src: "/screens/shops.png", alt: ar.shopsShot }}
      side="end"
      cta={{ href: "#download", label: ar.shopsCta }}
    />
  );
}
```

- [ ] **Step 6: Append feature-row styles to end of `src/brand.css`**

```css

/* --- Feature row --- */
.feature { display: grid; gap: clamp(24px, 5vw, 56px); align-items: center; }
.feature-visual { display: flex; justify-content: center; }
@media (min-width: 768px) {
  .feature { grid-template-columns: 0.9fr 1.1fr; }
  .feature-start .feature-visual { order: 1; }
  .feature-start .feature-text { order: 2; }
  .feature-end .feature-visual { order: 2; }
  .feature-end .feature-text { order: 1; }
}
.feature-points { display: grid; gap: 16px; margin-top: 18px; }
.feature-points li { display: flex; gap: 12px; align-items: flex-start; }
.feature-ic {
  flex: none; width: 40px; height: 40px; border-radius: var(--r-sm);
  display: grid; place-items: center; background: var(--tint); color: var(--coral);
}
.feature-points strong { font-weight: 700; display: block; }
.feature-desc { display: block; }
.feature-text .btn-secondary { margin-top: 22px; }
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/components/landing/FeatureRow.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/FeatureRow.tsx src/components/landing/FeatureRow.test.tsx src/components/landing/ForShoppers.tsx src/components/landing/ForShops.tsx src/brand.css
git commit -m "feat(landing): alternating feature rows for shoppers and shops"
```

---

### Task 9: HowItWorks rewrite

**Files:**
- Modify: `src/components/landing/HowItWorks.tsx` (full rewrite)
- Modify: `src/brand.css` (append step-card styles)
- Test: `src/components/landing/HowItWorks.test.tsx`

**Interfaces:**
- Consumes: `useReveal` (Task 4), `ar` keys `howTitle/howSteps/howDesc`.
- Produces: `HowItWorks` as `<section class="section band-tint">` with three `.how-step` cards numbered 1–3.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/HowItWorks.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";
import { ar } from "../../content/strings";

it("renders three numbered steps", () => {
  render(<HowItWorks />);
  expect(screen.getByText("كيف يعمل")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText(ar.howSteps[0])).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/HowItWorks.test.tsx`
Expected: FAIL — current markup has no numbered "1"/"3" elements.

- [ ] **Step 3: Rewrite `src/components/landing/HowItWorks.tsx`**

```tsx
import { ar } from "../../content/strings";
import { useReveal } from "../../hooks/useReveal";

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section band-tint">
      <div ref={ref} className="container how reveal">
        <h2 className="h2 how-title">{ar.howTitle}</h2>
        <ol className="how-steps">
          {ar.howSteps.map((s, i) => (
            <li className="how-step" key={s}>
              <span className="how-num">{i + 1}</span>
              <h3 className="how-step-title">{s}</h3>
              <p className="lead">{ar.howDesc[i]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Append step-card styles to end of `src/brand.css`**

```css

/* --- How it works --- */
.how-title { text-align: center; }
.how-steps { display: grid; gap: 20px; margin-top: 28px; }
@media (min-width: 768px) { .how-steps { grid-template-columns: repeat(3, 1fr); } }
.how-step {
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 24px; text-align: center;
  box-shadow: var(--shadow-sm);
}
.how-num {
  display: inline-grid; place-items: center; width: 44px; height: 44px;
  border-radius: 999px; background: var(--coral); color: var(--on-coral);
  font-weight: 800; font-size: 18px;
}
.how-step-title { font-size: 18px; margin: 12px 0 6px; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/HowItWorks.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/HowItWorks.tsx src/components/landing/HowItWorks.test.tsx src/brand.css
git commit -m "feat(landing): how-it-works step cards"
```

---

### Task 10: Download rewrite (dark band + QR + collapsible checksum)

**Files:**
- Modify: `src/components/landing/Download.tsx` (rewrite, keep `APK_URL` + `APK_SHA256` constants verbatim)
- Modify: `src/brand.css` (append download styles)
- Test: `src/components/landing/Download.test.tsx`

**Interfaces:**
- Consumes: `Icon` (Task 2), `ar` keys `downloadTitle/androidNote/downloadCta/qrHint/sideloadNote/playSoon/checksumLabel`; placeholder asset `/qr-download.png`.
- Produces: `Download` as `<section id="download" class="section band-dark">`; APK link, QR `<img>`, `<details>` checksum.

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Download.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Download } from "./Download";
import { ar } from "../../content/strings";

it("renders the APK link, the QR image and the collapsible checksum", () => {
  render(<Download />);
  const dl = screen.getByRole("link", { name: "حمّل التطبيق" });
  expect(dl.getAttribute("href")).toContain("yalla-maksab.apk");
  expect(screen.getByRole("img", { name: ar.qrHint })).toBeInTheDocument();
  expect(screen.getByText("بصمة الملف (SHA-256):")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/Download.test.tsx`
Expected: FAIL — current Download has no QR image; checksum is not inside a `<details>` summary with that exact text role lookup may still pass for text, but the QR `img` assertion fails.

- [ ] **Step 3: Rewrite `src/components/landing/Download.tsx`**

```tsx
import { ar } from "../../content/strings";
import { Icon } from "./Icon";

// Public repo (maksab is private — its release assets aren't publicly downloadable).
// Founder attaches the signed APK named yalla-maksab.apk to a release on maksab-link.
const APK_URL = "https://github.com/sahyoni-tech/maksab-link/releases/latest/download/yalla-maksab.apk";
// SHA-256 of the signed release APK built 2026-06-22 (post-audit fixes; versionCode 2, maksab-link v1.0.1).
// MUST match the exact yalla-maksab.apk uploaded to the maksab-link release.
const APK_SHA256 = "0dbc49a1a6cf5c97117f686dfcda19dcdbcff44fa62a874d0ef1dabb8cdd4ec1";

export function Download() {
  return (
    <section id="download" className="section band-dark">
      <div className="container download">
        <h2 className="h2">{ar.downloadTitle}</h2>
        <p className="lead">{ar.androidNote}</p>
        <div className="download-actions">
          <a className="btn-primary" href={APK_URL}><Icon name="download" />{ar.downloadCta}</a>
          <div className="download-qr">
            <img src="/qr-download.png" alt={ar.qrHint} width={120} height={120} />
            <span>{ar.qrHint}</span>
          </div>
        </div>
        <p className="lead download-note">{ar.sideloadNote}</p>
        <p className="lead">{ar.playSoon}</p>
        {APK_SHA256 && (
          <details className="checksum">
            <summary>{ar.checksumLabel}</summary>
            <code>{APK_SHA256}</code>
          </details>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Append download styles to end of `src/brand.css`**

```css

/* --- Download band --- */
.download { text-align: center; }
.download-actions {
  display: flex; flex-wrap: wrap; gap: 24px;
  align-items: center; justify-content: center; margin-top: 18px;
}
.download-qr {
  display: none; flex-direction: column; align-items: center; gap: 6px;
  font-size: 13px; color: #C9C4BA;
}
.download-qr img { background: #fff; border-radius: var(--r-sm); padding: 8px; }
@media (min-width: 768px) { .download-qr { display: inline-flex; } }
.download-note { margin-top: 16px; }
.checksum { margin-top: 18px; font-size: 13px; color: #C9C4BA; }
.checksum summary { cursor: pointer; }
.checksum code { display: block; margin-top: 8px; word-break: break-all; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/landing/Download.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/landing/Download.tsx src/components/landing/Download.test.tsx src/brand.css
git commit -m "feat(landing): dark download band with QR and collapsible checksum"
```

---

### Task 11: Contact + Footer rewrite

**Files:**
- Modify: `src/components/landing/Contact.tsx` (rewrite)
- Modify: `src/components/landing/Footer.tsx` (rewrite)
- Modify: `src/brand.css` (append contact + footer styles)
- Test: `src/components/landing/Contact.test.tsx`

**Interfaces:**
- Consumes: `Icon` (Task 2), `ar` keys `contactTitle/contactTelegram/contactWhatsapp/brand/privacy/terms/rights`.
- Produces: `Contact` as `<section id="contact" class="section">`; `Footer` as `<footer class="site-footer">`. `TELEGRAM_URL`/`WHATSAPP_URL` are founder-filled constants (empty → channel hidden; only email is live until supplied).

- [ ] **Step 1: Write the failing test**

Create `src/components/landing/Contact.test.tsx`:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";

it("renders the email channel as a mailto link", () => {
  render(<Contact />);
  const mail = screen.getByRole("link", { name: /hello@yallamaksab\.com/ });
  expect(mail).toHaveAttribute("href", "mailto:hello@yallamaksab.com");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/landing/Contact.test.tsx`
Expected: FAIL — current Contact renders the email but the accessible name includes no icon yet; this test still compiles but file import path is fine — if it passes already, proceed (the rewrite keeps it green). If module differences cause failure, that confirms the test drives the rewrite.

> Note: this section's redesign is visual; the test pins the durable contract (a working mailto link) so the rewrite can't regress it.

- [ ] **Step 3: Rewrite `src/components/landing/Contact.tsx`**

```tsx
import { ar } from "../../content/strings";
import { Icon } from "./Icon";

// Founder fills real handles in the founder runbook. Until supplied, only email is live.
const TELEGRAM_URL = ""; // e.g. https://t.me/yallamaksab
const WHATSAPP_URL = ""; // e.g. https://wa.me/9639XXXXXXXX

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container contact">
        <h2 className="h2">{ar.contactTitle}</h2>
        <div className="contact-channels">
          {TELEGRAM_URL && (
            <a className="btn-secondary" href={TELEGRAM_URL}><Icon name="telegram" />{ar.contactTelegram}</a>
          )}
          {WHATSAPP_URL && (
            <a className="btn-secondary" href={WHATSAPP_URL}><Icon name="whatsapp" />{ar.contactWhatsapp}</a>
          )}
          <a className="btn-secondary" href="mailto:hello@yallamaksab.com"><Icon name="mail" />hello@yallamaksab.com</a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/landing/Footer.tsx`**

```tsx
import { ar } from "../../content/strings";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-row">
        <div className="site-brand">
          <img src="/icon-192.png" alt="" width={28} height={28} />
          <span>{ar.brand}</span>
        </div>
        <nav className="site-footer-links">
          <a href="https://maksab.link/privacy">{ar.privacy}</a>
          <a href="https://maksab.link/terms">{ar.terms}</a>
        </nav>
        <p className="site-footer-rights">{ar.rights}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Append contact + footer styles to end of `src/brand.css`**

```css

/* --- Contact --- */
.contact { text-align: center; }
.contact-channels {
  display: flex; flex-wrap: wrap; gap: 12px;
  justify-content: center; margin-top: 16px;
}

/* --- Footer --- */
.site-footer { border-top: 1px solid var(--border); padding-block: 28px; color: var(--muted); }
.site-footer-row {
  display: flex; flex-wrap: wrap; gap: 14px 24px;
  align-items: center; justify-content: space-between;
}
.site-footer-links { display: flex; gap: 18px; }
.site-footer-links a { color: var(--muted); text-decoration: none; }
.site-footer-links a:hover { color: var(--coral); }
.site-footer-rights { font-size: 14px; }
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/landing/Contact.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/Contact.tsx src/components/landing/Footer.tsx src/components/landing/Contact.test.tsx src/brand.css
git commit -m "feat(landing): contact channels and refreshed footer"
```

---

### Task 12: Compose Landing + integration test + quality gates

**Files:**
- Modify: `src/pages/Landing.tsx` (add Header + ValueStrip in order)
- Modify: `src/pages/Landing.test.tsx` (extend integration assertions)

**Interfaces:**
- Consumes: all section components from Tasks 5–11.
- Produces: final `Landing` composition: `Header → Hero → ValueStrip → ForShoppers → ForShops → HowItWorks → Download → Contact → Footer`.

- [ ] **Step 1: Update the integration test**

Replace `src/pages/Landing.test.tsx` with:

```tsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Landing } from "./Landing";

it("renders the tagline and all top-level sections", () => {
  render(<Landing />);
  expect(screen.getByText("عروض بالقرب منك")).toBeInTheDocument();
  expect(screen.getByText("للزبائن")).toBeInTheDocument();
  expect(screen.getByText("للمتاجر")).toBeInTheDocument();
  expect(screen.getByText("كيف يعمل")).toBeInTheDocument();
  expect(screen.getByText("تواصل معنا")).toBeInTheDocument();
});

it("exposes download CTAs from the header, hero and download band", () => {
  render(<Landing />);
  const links = screen.getAllByRole("link", { name: "حمّل التطبيق" });
  expect(links.length).toBeGreaterThanOrEqual(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/Landing.test.tsx`
Expected: FAIL — `Landing` does not yet render Header/ValueStrip, so the ≥3 download links assertion fails (only Hero + Download = 2).

- [ ] **Step 3: Rewrite `src/pages/Landing.tsx`**

```tsx
import { Header } from "../components/landing/Header";
import { Hero } from "../components/landing/Hero";
import { ValueStrip } from "../components/landing/ValueStrip";
import { ForShoppers } from "../components/landing/ForShoppers";
import { ForShops } from "../components/landing/ForShops";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Download } from "../components/landing/Download";
import { Contact } from "../components/landing/Contact";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <>
      <Header />
      <Hero />
      <ValueStrip />
      <ForShoppers />
      <ForShops />
      <HowItWorks />
      <Download />
      <Contact />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/Landing.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full quality gates**

Run: `npm test && npm run typecheck && npm run lint && npm run build`
Expected: all green — every test passes, no type errors, no lint errors, build emits `dist/`.

If lint flags unused imports or `react-refresh/only-export-components` on any file, fix inline (e.g. ensure each component file exports only its component; `Icon.tsx` exporting the `IconName` type alongside the component is allowed).

- [ ] **Step 6: Verify the landing chunk stays lean (no supabase on landing)**

Run: `grep -rl "supabase" dist/assets/*.js | xargs -I{} basename {}` then confirm the landing entry chunk is not among supabase-containing chunks (admin chunk only). Quick check:

Run: `ls -la dist/assets/*.js`
Expected: a separate admin chunk exists; landing entry chunk size is in the same order of magnitude as before this work (no new dependency pulled in).

- [ ] **Step 7: Commit**

```bash
git add src/pages/Landing.tsx src/pages/Landing.test.tsx
git commit -m "feat(landing): compose polished landing and extend integration test"
```

---

## Post-implementation (founder handoff)

These are not code tasks — note them in the PR / handoff:

1. Replace placeholders in `public/screens/` with real app screenshots (deals feed → `hero.png`, saved/follow → `shoppers.png`, shop dashboard/post-deal → `shops.png`). Portrait PNGs; same filenames, no code change.
2. Fill `TELEGRAM_URL` / `WHATSAPP_URL` in `src/components/landing/Contact.tsx`.
3. Confirm `/qr-download.png` encodes the public download URL.
4. Optional: swap the header brand text for a dark-text-on-transparent wordmark image if design provides one.

## Self-Review notes

- **Spec coverage:** sticky header (Task 5), hero+phone (Task 6), value strip (Task 7), equal-weight alternating shoppers/shops rows (Task 8), step cards (Task 9), dark download band + QR + collapsible checksum (Task 10), contact channels + footer (Task 11), CSS-class migration + tokens + fonts + copy (Task 1), motion via `useReveal` + reduced-motion (Tasks 4/1), testing gates (Task 12). All spec sections map to a task.
- **Placeholder scan:** screenshot/handle placeholders are real product placeholders (documented in handoff), not plan gaps; every code step contains full code.
- **Type consistency:** `IconName` defined in Task 2 is the single source; `ValueStrip`, `FeatureRow`, `ForShoppers`, `ForShops` all consume it. `useReveal<HTMLDivElement>()` returns `RefObject<HTMLDivElement | null>` used identically in Hero/FeatureRow/HowItWorks. `FeatureRow` `Point` shape `{icon,text,desc}` matches the `.map` builders in the two section files.

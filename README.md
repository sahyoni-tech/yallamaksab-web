# yallamaksab-web

Landing page (`yallamaksab.com`) + gated admin shell (`/admin`) for Yalla Maksab.
Vite + React + TS + Supabase. Talks to the existing Supabase project (anon key).

## Local dev
1. `cp .env.example .env` and fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
   (same values as the mobile app's `EXPO_PUBLIC_SUPABASE_*`).
2. `npm install && npm run dev`
3. `npm test` / `npm run typecheck` / `npm run build`

## Deploy (Cloudflare Pages)
- Connect this repo. Build command `npm run build`, output dir `dist`.
- Set env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in the Pages project.
- Custom domains: `yallamaksab.com` (apex) and `admin.yallamaksab.com` → same project.
- In Supabase Auth → URL config, add `https://yallamaksab.com` and
  `https://admin.yallamaksab.com` to the allowed redirect URLs (magic-link target).

## Release the APK (download button target)
- The button points at
  `https://github.com/sahyoni-tech/maksab-link/releases/latest/download/yalla-maksab.apk`
  (never changes).
- ⚠️ It MUST be a release on the **public** `maksab-link` repo — the `maksab` app repo
  is private, and private-repo release assets are not publicly downloadable.
- Build the signed production APK in the mobile repo, rename it `yalla-maksab.apk`,
  and attach it to a new GitHub release on `sahyoni-tech/maksab-link`.
- Compute the checksum: `shasum -a 256 yalla-maksab.apk` and paste it into
  `APK_SHA256` in `src/components/landing/Download.tsx`.

## Brand assets
- `public/wordmark.svg` is copied from `MAKSAB/yalla-maksab-logo/screen.svg` — it has a
  **dark panel baked in**, so on the cream page it renders as a dark card. Replace with a
  light/transparent wordmark export when design provides one.
- Favicons + `apple-touch-icon.png` are generated from `MAKSAB/assets/images/icon.png`.

## Seed an admin (one-time, founder)
- The admin must be a Supabase Auth user whose id is in the `admins` table.
- Sign in once via the magic link to create the auth user, then in the Supabase
  SQL editor: `insert into admins (user_id) values ('<that-auth-uid>');`

## Contact channels (fill when supplied)
- Edit `src/components/landing/Contact.tsx` with the real Telegram / WhatsApp / email.

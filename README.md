# yallamaksab-web

Landing page (`yallamaksab.com`) + gated admin shell (`/admin`) for Yalla Maksab.
Vite + React + TS + Supabase. Talks to the existing Supabase project (anon key).

## Local dev
1. `cp .env.example .env` and fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
   (same values as the mobile app's `EXPO_PUBLIC_SUPABASE_*`).
2. `npm install && npm run dev`
3. `npm test` / `npm run typecheck` / `npm run build`

## Quality gate
- Scripts: `npm run format` (Prettier write), `npm run format:check`, `npm run lint`,
  `npm run typecheck`, `npm test`, `npm run build`.
- CI (`.github/workflows/ci.yml`) runs `format:check → lint → build → test` on every
  push to `main` and on PRs. `build` is `tsc -b && vite build`, so it covers the
  typecheck. Prettier owns code + config only (docs / `.superpowers` / markdown ignored).

## Deploy (Cloudflare Pages)
- Connect this repo. Build command `npm run build`, output dir `dist`.
- Set env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in the Pages project.
- Custom domains: `yallamaksab.com` (apex) and `admin.yallamaksab.com` → same project.
- Admin login uses an email **OTP code** (not a magic link), so no redirect URL is
  required for sign-in. Still set the Site URL in Supabase Auth → URL config to
  `https://admin.yallamaksab.com`.

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

## Admin login (email OTP code)
- Sign-in at `/admin` is passwordless: enter email → Supabase emails a numeric code →
  enter it. No magic link.
- Requires the Supabase **Magic Link email template to emit the code** (`{{ .Token }}`).
  **Auth → Email OTP Length** sets the digit count; the form adapts to any length.
- `signInWithOtp` runs with `shouldCreateUser: false`, so the login screen **cannot
  create accounts** — the admin's auth user must already exist (see below).
- The web admin idle-logs-out after 30 min (client-side, in `useSession`). Do **not**
  tighten Supabase Auth session timeout / max-length — those are project-wide and
  shared with the mobile app, so they would log out app users too.

## Seed an admin (one-time, founder)
1. Create the auth user in Supabase **dashboard → Authentication → Users → Add user**.
   The login screen won't create it (`shouldCreateUser:false`).
2. Grant admin in the SQL editor:
   `insert into admins (user_id) values ('<that-auth-uid>');`
3. That user can now request a code at `/admin` and sign in.

## Contact channels (fill when supplied)
- Edit `src/components/landing/Contact.tsx` with the real Telegram / WhatsApp / email.

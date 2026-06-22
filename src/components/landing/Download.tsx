import { ar } from "../../content/strings";

// Public repo (maksab is private — its release assets aren't publicly downloadable).
// Founder attaches the signed APK named yalla-maksab.apk to a release on maksab-link.
const APK_URL = "https://github.com/sahyoni-tech/maksab-link/releases/latest/download/yalla-maksab.apk";
// SHA-256 of the signed release APK built 2026-06-22 (post-audit fixes; versionCode 2, maksab-link v1.0.1).
// MUST match the exact yalla-maksab.apk uploaded to the maksab-link release.
const APK_SHA256 = "0dbc49a1a6cf5c97117f686dfcda19dcdbcff44fa62a874d0ef1dabb8cdd4ec1";

export function Download() {
  return (
    <section id="download" className="container" style={{ paddingBlock: 48, textAlign: "center" }}>
      <h2 style={{ fontSize: 26 }}>{ar.downloadTitle}</h2>
      <p style={{ color: "var(--muted)" }}>{ar.androidNote}</p>
      <a className="btn-primary" href={APK_URL} style={{ marginTop: 12 }}>{ar.downloadCta}</a>
      <p style={{ color: "var(--muted)", marginTop: 12 }}>{ar.sideloadNote}</p>
      <p style={{ color: "var(--muted)" }}>{ar.playSoon}</p>
      {APK_SHA256 && (
        <p style={{ fontSize: 13, color: "var(--muted)", wordBreak: "break-all" }}>
          {ar.checksumLabel} <code>{APK_SHA256}</code>
        </p>
      )}
    </section>
  );
}

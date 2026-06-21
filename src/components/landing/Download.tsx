import { ar } from "../../content/strings";

// Public repo (maksab is private — its release assets aren't publicly downloadable).
// Founder attaches the signed APK named yalla-maksab.apk to a release on maksab-link.
const APK_URL = "https://github.com/sahyoni-tech/maksab-link/releases/latest/download/yalla-maksab.apk";
// SHA-256 of the signed release APK built 2026-06-21 (preview profile, versionCode 2).
// MUST match the exact yalla-maksab.apk uploaded to the maksab-link release.
const APK_SHA256 = "10b2fb2a8fe3662212c4acc586ba49e3bbc8324040f1502e889d00542d684d67";

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

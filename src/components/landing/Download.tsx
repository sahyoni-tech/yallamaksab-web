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

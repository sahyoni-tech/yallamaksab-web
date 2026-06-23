import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Download } from "./Download";
import { ar } from "../../content/strings";

it("renders the APK link, the QR image and the collapsible checksum", () => {
  render(<Download />);
  const dl = screen.getByRole("link", { name: ar.downloadCta });
  expect(dl.getAttribute("href")).toContain("yalla-maksab.apk");
  expect(screen.getByRole("img", { name: ar.qrHint })).toBeInTheDocument();
  expect(screen.getByText("بصمة الملف (SHA-256):")).toBeInTheDocument();
});

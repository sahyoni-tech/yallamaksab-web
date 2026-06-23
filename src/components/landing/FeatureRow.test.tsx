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
    />,
  );
  expect(container.querySelector(".feature-end")).not.toBeNull();
  expect(screen.getByRole("img", { name: "لقطة" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "سجّل متجرك" })).toHaveAttribute("href", "#download");
});

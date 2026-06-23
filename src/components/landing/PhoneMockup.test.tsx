import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhoneMockup } from "./PhoneMockup";

it("renders the screenshot with its alt text and src", () => {
  render(<PhoneMockup src="/screens/hero.png" alt="لقطة" />);
  const img = screen.getByRole("img", { name: "لقطة" });
  expect(img).toHaveAttribute("src", "/screens/hero.png");
});

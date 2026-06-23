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

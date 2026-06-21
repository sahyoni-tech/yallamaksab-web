import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Landing } from "./Landing";

it("renders the brand tagline and a download link", () => {
  render(<Landing />);
  expect(screen.getByText("عروض بالقرب منك")).toBeInTheDocument();
  const links = screen.getAllByRole("link", { name: "حمّل التطبيق" });
  expect(links.length).toBeGreaterThan(0);
});

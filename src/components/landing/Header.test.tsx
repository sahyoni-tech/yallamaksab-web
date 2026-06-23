import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

it("shows the brand and a download link to #download", () => {
  render(<Header />);
  expect(screen.getByText("يلا مكسب")).toBeInTheDocument();
  const cta = screen.getByRole("link", { name: "حمّل التطبيق" });
  expect(cta).toHaveAttribute("href", "#download");
});

import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Landing } from "./Landing";

it("renders the tagline and all top-level sections", () => {
  render(<Landing />);
  expect(screen.getByText("عروض بالقرب منك")).toBeInTheDocument();
  expect(screen.getByText("للزبائن")).toBeInTheDocument();
  expect(screen.getByText("للمتاجر")).toBeInTheDocument();
  expect(screen.getByText("كيف يعمل")).toBeInTheDocument();
  expect(screen.getByText("تواصل معنا")).toBeInTheDocument();
});

it("exposes download CTAs from the header, hero and download band", () => {
  render(<Landing />);
  const links = screen.getAllByRole("link", { name: "حمّل التطبيق" });
  expect(links.length).toBeGreaterThanOrEqual(3);
});

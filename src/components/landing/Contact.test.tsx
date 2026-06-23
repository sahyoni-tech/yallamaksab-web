import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";

it("renders the email channel as a mailto link", () => {
  render(<Contact />);
  const mail = screen.getByRole("link", { name: /hello@yallamaksab\.com/ });
  expect(mail).toHaveAttribute("href", "mailto:hello@yallamaksab.com");
});

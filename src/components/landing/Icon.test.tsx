import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon, type IconName } from "./Icon";

const names: IconName[] = [
  "pin", "heart", "bookmark", "megaphone", "users", "bell",
  "download", "telegram", "whatsapp", "mail", "check", "tag", "bolt",
];

it.each(names)("renders an svg tagged with the icon name: %s", (name) => {
  const { container } = render(<Icon name={name} />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("data-icon")).toBe(name);
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
  expect(svg?.classList.contains("icon")).toBe(true);
});

it("appends a caller-supplied className while keeping the base icon class", () => {
  const { container } = render(<Icon name="download" className="big" />);
  const svg = container.querySelector("svg");
  expect(svg?.classList.contains("icon")).toBe(true);
  expect(svg?.classList.contains("big")).toBe(true);
});

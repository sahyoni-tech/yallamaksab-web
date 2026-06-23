import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

it("renders an svg tagged with the icon name", () => {
  const { container } = render(<Icon name="download" />);
  const svg = container.querySelector("svg");
  expect(svg).not.toBeNull();
  expect(svg?.getAttribute("data-icon")).toBe("download");
  expect(svg?.getAttribute("aria-hidden")).toBe("true");
});

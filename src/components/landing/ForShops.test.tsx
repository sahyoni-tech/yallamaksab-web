import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ForShops } from "./ForShops";
import { ar } from "../../content/strings";

it("renders one valid icon per shop point (icons stay aligned with copy)", () => {
  const { container } = render(<ForShops />);
  const icons = container.querySelectorAll(".feature-ic svg[data-icon]");
  expect(icons.length).toBe(ar.shopsPoints.length);
  icons.forEach((svg) => expect(svg.getAttribute("data-icon")).toBeTruthy());
});

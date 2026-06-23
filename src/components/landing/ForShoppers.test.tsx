import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ForShoppers } from "./ForShoppers";
import { ar } from "../../content/strings";

it("renders one valid icon per shopper point (icons stay aligned with copy)", () => {
  const { container } = render(<ForShoppers />);
  const icons = container.querySelectorAll(".feature-ic svg[data-icon]");
  expect(icons.length).toBe(ar.shoppersPoints.length);
  icons.forEach((svg) => expect(svg.getAttribute("data-icon")).toBeTruthy());
});

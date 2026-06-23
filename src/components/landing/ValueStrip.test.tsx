import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValueStrip } from "./ValueStrip";

it("renders the three value chips", () => {
  render(<ValueStrip />);
  expect(screen.getByText("قريب منك")).toBeInTheDocument();
  expect(screen.getByText("مجاني")).toBeInTheDocument();
  expect(screen.getByText("فوري")).toBeInTheDocument();
});

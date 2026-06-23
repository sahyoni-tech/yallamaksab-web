import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";
import { ar } from "../../content/strings";

it("renders three numbered steps", () => {
  render(<HowItWorks />);
  expect(screen.getByText("كيف يعمل")).toBeInTheDocument();
  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText(ar.howSteps[0])).toBeInTheDocument();
});

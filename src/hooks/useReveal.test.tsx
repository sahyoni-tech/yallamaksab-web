import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useReveal } from "./useReveal";

function Probe() {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className="reveal" data-testid="r" />;
}

it("falls back to visible when IntersectionObserver is unavailable", () => {
  // jsdom provides no IntersectionObserver, so the hook takes its fallback path.
  const { getByTestId } = render(<Probe />);
  expect(getByTestId("r").classList.contains("is-visible")).toBe(true);
});

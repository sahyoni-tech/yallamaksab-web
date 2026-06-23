import { it, expect } from "vitest";
import { ar } from "./strings";

it("aligns each description array with its point/step array", () => {
  expect(ar.shoppersDesc.length).toBe(ar.shoppersPoints.length);
  expect(ar.shopsDesc.length).toBe(ar.shopsPoints.length);
  expect(ar.howDesc.length).toBe(ar.howSteps.length);
});

it("has the new hero, nav and value-strip copy", () => {
  expect(ar.navDownload).toBeTruthy();
  expect(ar.androidChip).toBeTruthy();
  expect(ar.heroShot).toBeTruthy();
  expect(ar.valueNear).toBeTruthy();
  expect(ar.qrHint).toBeTruthy();
});

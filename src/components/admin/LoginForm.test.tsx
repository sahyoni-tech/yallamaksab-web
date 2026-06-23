import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ar } from "../../content/strings";

const { signInWithOtp, verifyOtp } = vi.hoisted(() => ({
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: { auth: { signInWithOtp, verifyOtp } },
}));

import { LoginForm } from "./LoginForm";

beforeEach(() => {
  signInWithOtp.mockReset().mockResolvedValue({ error: null });
  verifyOtp.mockReset().mockResolvedValue({ error: null });
});

it("requests a code without creating an account, then reveals the code field", async () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "admin@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: ar.adminSendLink }));

  await waitFor(() =>
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "admin@example.com",
      options: { shouldCreateUser: false },
    }),
  );
  expect(await screen.findByText(ar.adminCodeLabel)).toBeInTheDocument();
});

it("verifies the typed code via verifyOtp", async () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "admin@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: ar.adminSendLink }));

  await screen.findByText(ar.adminCodeLabel);
  const codeInput = screen.getByRole("textbox");
  fireEvent.change(codeInput, { target: { value: "12345678" } });
  fireEvent.click(screen.getByRole("button", { name: ar.adminVerify }));

  await waitFor(() =>
    expect(verifyOtp).toHaveBeenCalledWith({
      email: "admin@example.com",
      token: "12345678",
      type: "email",
    }),
  );
});

it("keeps only digits in the code field", async () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "admin@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: ar.adminSendLink }));

  await screen.findByText(ar.adminCodeLabel);
  const codeInput = screen.getByRole("textbox");
  fireEvent.change(codeInput, { target: { value: "1a2b3" } });
  expect(codeInput).toHaveValue("123");
});

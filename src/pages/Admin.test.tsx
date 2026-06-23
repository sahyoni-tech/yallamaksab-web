import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ar } from "../content/strings";
import type { SessionState } from "../hooks/useSession";

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));

vi.mock("../lib/supabase", () => ({ supabase: { auth: { signOut } } }));

let sessionState: SessionState;
vi.mock("../hooks/useSession", () => ({ useSession: () => sessionState }));

// Stub the data lists so this test stays focused on Admin's own gating/chrome.
vi.mock("../components/admin/PendingList", () => ({ PendingList: () => <div>pending</div> }));
vi.mock("../components/admin/FeedbackList", () => ({ FeedbackList: () => <div>feedback</div> }));

import { Admin } from "./Admin";

const fakeSession = {} as SessionState["session"];

beforeEach(() => signOut.mockReset());

it("shows the login form when there is no session", () => {
  sessionState = { session: null, isAdmin: false, loading: false };
  render(<Admin />);
  expect(screen.getByText(ar.adminTitle)).toBeInTheDocument();
});

it("lets a signed-in non-admin sign out instead of stranding them", () => {
  sessionState = { session: fakeSession, isAdmin: false, loading: false };
  render(<Admin />);
  expect(screen.getByText(ar.adminNotAuthorized)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: ar.adminSignOut }));
  expect(signOut).toHaveBeenCalled();
});

it("offers sign-out on the admin panel itself", () => {
  sessionState = { session: fakeSession, isAdmin: true, loading: false };
  render(<Admin />);
  expect(screen.getByRole("button", { name: ar.adminSignOut })).toBeInTheDocument();
});

import { describe, it, expect, vi } from "vitest";
import { fetchPendingMerchants, approveMerchant, rejectMerchant } from "./admin";
import { fetchFeedback, resolveFeedback } from "./admin";

// A minimal fake of the supabase client shaped to what admin.ts calls.
function fakeClient(over: Record<string, unknown> = {}) {
  return over as unknown as import("@supabase/supabase-js").SupabaseClient;
}

describe("fetchPendingMerchants", () => {
  it("queries merchants with approval_status=pending, newest first", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [{ id: "m1", business_name: "متجر", category: "food", created_at: "2026-06-01" }],
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = fakeClient({ from });

    const rows = await fetchPendingMerchants(client);

    expect(from).toHaveBeenCalledWith("merchants");
    expect(eq).toHaveBeenCalledWith("approval_status", "pending");
    expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rows).toHaveLength(1);
    expect(rows[0].business_name).toBe("متجر");
  });

  it("throws on a query error", async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const client = fakeClient({
      from: () => ({ select: () => ({ eq: () => ({ order }) }) }),
    });
    await expect(fetchPendingMerchants(client)).rejects.toThrow("boom");
  });
});

describe("approveMerchant / rejectMerchant", () => {
  it("approve calls the approve_merchant RPC with the id", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });
    await approveMerchant(fakeClient({ rpc }), "m1");
    expect(rpc).toHaveBeenCalledWith("approve_merchant", { p_merchant_id: "m1" });
  });

  it("reject calls the reject_merchant RPC with id + reason", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });
    await rejectMerchant(fakeClient({ rpc }), "m1", "مخالف");
    expect(rpc).toHaveBeenCalledWith("reject_merchant", { p_merchant_id: "m1", p_reason: "مخالف" });
  });

  it("throws on an RPC error", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: { message: "denied" } });
    await expect(approveMerchant(fakeClient({ rpc }), "m1")).rejects.toThrow("denied");
  });
});

describe("fetchFeedback / resolveFeedback", () => {
  it("fetch calls the admin_list_feedback RPC and returns rows", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [{ id: "f1", type: "bug", message: "crash", contact: null, platform: "android", app_version: "1.0.2", merchant_id: null, resolved: false, created_at: "2026-06-23" }],
      error: null,
    });
    const rows = await fetchFeedback(fakeClient({ rpc }));
    expect(rpc).toHaveBeenCalledWith("admin_list_feedback");
    expect(rows).toHaveLength(1);
    expect(rows[0].message).toBe("crash");
  });

  it("resolve calls the admin_resolve_feedback RPC with id + flag", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });
    await resolveFeedback(fakeClient({ rpc }), "f1", true);
    expect(rpc).toHaveBeenCalledWith("admin_resolve_feedback", { p_id: "f1", p_resolved: true });
  });

  it("fetch throws on an RPC error", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "denied" } });
    await expect(fetchFeedback(fakeClient({ rpc }))).rejects.toThrow("denied");
  });
});

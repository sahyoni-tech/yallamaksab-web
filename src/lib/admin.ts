import type { SupabaseClient } from "@supabase/supabase-js";

export type PendingMerchant = {
  id: string;
  business_name: string;
  category: string;
  created_at: string;
};

export async function fetchPendingMerchants(client: SupabaseClient): Promise<PendingMerchant[]> {
  const { data, error } = await client
    .from("merchants")
    .select("id, business_name, category, created_at")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PendingMerchant[];
}

export async function approveMerchant(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.rpc("approve_merchant", { p_merchant_id: id });
  if (error) throw new Error(error.message);
}

export async function rejectMerchant(client: SupabaseClient, id: string, reason?: string): Promise<void> {
  const { error } = await client.rpc("reject_merchant", { p_merchant_id: id, p_reason: reason ?? null });
  if (error) throw new Error(error.message);
}

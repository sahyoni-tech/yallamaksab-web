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

export async function rejectMerchant(
  client: SupabaseClient,
  id: string,
  reason?: string,
): Promise<void> {
  const { error } = await client.rpc("reject_merchant", {
    p_merchant_id: id,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
}

export type FeedbackItem = {
  id: string;
  type: "bug" | "idea" | "feedback" | "help";
  message: string;
  contact: string | null;
  platform: string | null;
  app_version: string | null;
  merchant_id: string | null;
  resolved: boolean;
  created_at: string;
};

export async function fetchFeedback(client: SupabaseClient): Promise<FeedbackItem[]> {
  const { data, error } = await client.rpc("admin_list_feedback");
  if (error) throw new Error(error.message);
  return (data ?? []) as FeedbackItem[];
}

export async function resolveFeedback(
  client: SupabaseClient,
  id: string,
  resolved: boolean,
): Promise<void> {
  const { error } = await client.rpc("admin_resolve_feedback", { p_id: id, p_resolved: resolved });
  if (error) throw new Error(error.message);
}

import { useState } from "react";
import { ar } from "../content/strings";
import { useSession } from "../hooks/useSession";
import { supabase } from "../lib/supabase";
import { LoginForm } from "../components/admin/LoginForm";
import { PendingList } from "../components/admin/PendingList";
import { FeedbackList } from "../components/admin/FeedbackList";

export function Admin() {
  const { session, isAdmin, loading } = useSession();
  const [tab, setTab] = useState<"pending" | "feedback">("pending");

  if (loading) return <p className="container">…</p>;
  if (!session) return <LoginForm />;

  const signOut = () => supabase.auth.signOut();

  // Any authenticated session can end itself — including a non-admin one,
  // which would otherwise be stranded on this screen with no way out.
  if (!isAdmin) {
    return (
      <div
        className="container"
        style={{
          paddingBlock: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <p>{ar.adminNotAuthorized}</p>
        <button className="btn-secondary" onClick={signOut}>
          {ar.adminSignOut}
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="container"
        style={{ display: "flex", gap: 8, paddingTop: 24, alignItems: "center" }}
      >
        <button
          className={tab === "pending" ? "btn-primary" : "btn-secondary"}
          onClick={() => setTab("pending")}
        >
          {ar.adminPendingTab}
        </button>
        <button
          className={tab === "feedback" ? "btn-primary" : "btn-secondary"}
          onClick={() => setTab("feedback")}
        >
          {ar.adminFeedbackTab}
        </button>
        <button className="btn-secondary" onClick={signOut} style={{ marginInlineStart: "auto" }}>
          {ar.adminSignOut}
        </button>
      </div>
      {tab === "pending" ? <PendingList /> : <FeedbackList />}
    </>
  );
}

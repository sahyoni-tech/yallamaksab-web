import { useState } from "react";
import { ar } from "../content/strings";
import { useSession } from "../hooks/useSession";
import { LoginForm } from "../components/admin/LoginForm";
import { PendingList } from "../components/admin/PendingList";
import { FeedbackList } from "../components/admin/FeedbackList";

export function Admin() {
  const { session, isAdmin, loading } = useSession();
  const [tab, setTab] = useState<"pending" | "feedback">("pending");

  if (loading) return <p className="container">…</p>;
  if (!session) return <LoginForm />;
  if (!isAdmin) return <p className="container" style={{ paddingBlock: 48 }}>{ar.adminNotAuthorized}</p>;

  return (
    <>
      <div className="container" style={{ display: "flex", gap: 8, paddingTop: 24 }}>
        <button className={tab === "pending" ? "btn-primary" : "btn-secondary"} onClick={() => setTab("pending")}>{ar.adminPendingTab}</button>
        <button className={tab === "feedback" ? "btn-primary" : "btn-secondary"} onClick={() => setTab("feedback")}>{ar.adminFeedbackTab}</button>
      </div>
      {tab === "pending" ? <PendingList /> : <FeedbackList />}
    </>
  );
}

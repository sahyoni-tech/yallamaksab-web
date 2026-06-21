import { ar } from "../content/strings";
import { useSession } from "../hooks/useSession";
import { LoginForm } from "../components/admin/LoginForm";
import { PendingList } from "../components/admin/PendingList";

export function Admin() {
  const { session, isAdmin, loading } = useSession();

  if (loading) return <p className="container">…</p>;
  if (!session) return <LoginForm />;
  if (!isAdmin) return <p className="container" style={{ paddingBlock: 48 }}>{ar.adminNotAuthorized}</p>;
  return <PendingList />;
}

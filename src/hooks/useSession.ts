import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type SessionState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

export function useSession(): SessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveAdmin = async (s: Session | null) => {
      if (!s) {
        if (active) { setIsAdmin(false); setLoading(false); }
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (active) {
        setIsAdmin(!error && data === true);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      resolveAdmin(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(true);
      resolveAdmin(s);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  return { session, isAdmin, loading };
}

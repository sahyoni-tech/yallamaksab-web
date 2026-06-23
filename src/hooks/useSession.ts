import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type SessionState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

// Web-only idle timeout. Lives in the client, not Supabase Auth settings,
// so it never logs out the mobile app (those settings are project-wide).
const IDLE_LIMIT_MS = 30 * 60 * 1000;

export function useSession(): SessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveAdmin = async (s: Session | null) => {
      if (!s) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
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

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Sign out after 30 min of no interaction. Listeners only bump a timestamp
  // (cheap); a 1-min interval enforces the deadline. Armed only while signed in.
  useEffect(() => {
    if (!session) return;
    let last = Date.now();
    const bump = () => {
      last = Date.now();
    };
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const id = window.setInterval(() => {
      if (Date.now() - last >= IDLE_LIMIT_MS) supabase.auth.signOut();
    }, 60 * 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(id);
    };
  }, [session]);

  return { session, isAdmin, loading };
}

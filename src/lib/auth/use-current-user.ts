import { useEffect, useState } from "react";
import { puterGetUser, puterIsSignedIn } from "./client";
export type AppUser = { id: string; displayName: string | null; primaryEmail: string | null; profileImageUrl: string | null; isDevFallback: boolean };
export type CurrentUserState = { user: AppUser | null; isPending: boolean };
export function useCurrentUserState(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({ user: null, isPending: true });
  useEffect(() => { let alive = true; const check = async () => { try { if (!puterIsSignedIn()) { if (alive) setState({ user: null, isPending: false }); return; } const u = await puterGetUser(); if (alive) setState({ user: { id: String(u.id ?? u.uuid ?? u.username ?? u.email ?? "puter-user"), displayName: u.name ?? u.username ?? null, primaryEmail: u.email ?? null, profileImageUrl: u.avatar ?? null, isDevFallback: false }, isPending: false }); } catch { if (alive) setState({ user: null, isPending: false }); } }; const timer = window.setTimeout(check, 250); return () => { alive = false; window.clearTimeout(timer); }; }, []);
  return state;
}
export function useCurrentUser() { return useCurrentUserState().user; }

import { useState, type ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { signIn, signOut } from "./client";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";
export const SIGN_IN_PATH = "/login";
export function SignedIn({ children }: { children: ReactNode }) { return <>{children}</>; }
export function SignedOut({ children }: { children: ReactNode }) { return null; }
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) { return <Navigate to={to} />; }
export function SignInGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) { const { user, isPending } = useCurrentUserState(); if (isPending) return null; return user ? <>{children}</> : <>{fallback ?? <SignInButtons />}</>; }
export function SignInButtons() { const [busy, setBusy] = useState(false); return <button type="button" disabled={busy} onClick={() => { setBusy(true); void signIn().catch(() => setBusy(false)); }} className="w-full cursor-pointer rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-elevated disabled:opacity-60">{busy ? "Opening Puter…" : "Continue with Puter"}</button>; }
export function UserButton() { const user = useCurrentUser(); const [busy, setBusy] = useState(false); if (!user) return <button type="button" onClick={() => void signIn()} className="rounded-md bg-elevated px-3 py-1.5 text-xs text-fg hover:bg-surface">Sign in with Puter</button>; const label = user.displayName ?? user.primaryEmail ?? "Puter"; return <div className="flex items-center gap-2"><span className="hidden text-xs text-muted sm:inline">{label}</span><button type="button" disabled={busy} onClick={() => { setBusy(true); void signOut().catch(() => setBusy(false)); }} className="rounded-md bg-elevated px-3 py-1.5 text-xs text-fg hover:bg-surface">{busy ? "Signing out…" : "Sign out"}</button></div>; }

declare global { interface Window { puter?: PuterApi } }
type PuterUser = { id?: string | number; username?: string; email?: string; name?: string; avatar?: string; uuid?: string };
type PuterModel = { id: string; provider?: string; name?: string };
type PuterApi = { auth: { isSignedIn(): boolean; signIn(): Promise<unknown>; signOut(): Promise<unknown>; getUser(): Promise<PuterUser> }; ai: { chat(prompt: unknown, options?: { model?: string; stream?: boolean; temperature?: number }): Promise<unknown>; listModels(): Promise<PuterModel[]> } };

export const authEnabled = true;
export const GROK_PROVIDERS = [{ providerId: "puter", idp: "puter", label: "Puter" }] as const;

export function getPuter(): PuterApi {
  if (typeof window === "undefined" || !window.puter) throw new Error("Puter is still loading. Please try again.");
  return window.puter;
}
export function puterIsSignedIn() { return getPuter().auth.isSignedIn(); }
export async function puterGetUser() { return getPuter().auth.getUser(); }
export async function listPuterModels() { return getPuter().ai.listModels(); }
export async function signIn(_providerId = "puter") { await getPuter().auth.signIn(); }
export async function signOut(_redirectTo = "/") { await getPuter().auth.signOut(); window.location.reload(); }
export function getBearerToken(): string | null { return null; }
export { GROK_PROVIDERS as PUTER_PROVIDERS };

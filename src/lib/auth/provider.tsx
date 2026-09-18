import { useEffect, type ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.puter) return;
    const existing = document.querySelector('script[data-puter-sdk="true"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.dataset.puterSdk = "true";
    document.head.appendChild(script);
  }, []);
  return <>{children}</>;
}

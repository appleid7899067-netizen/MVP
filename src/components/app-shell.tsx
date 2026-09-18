import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Plus, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { CowMark } from "@/components/cow-mark";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { MOBILE_TABS, NAV } from "@/lib/cow/nav";
import { useCowStore } from "@/lib/cow/store";
import { cn } from "@/lib/utils";
import { UserButton } from "@/lib/auth/gates";

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 py-3">
      {NAV.map((group) => (
        <div key={group.section}>
          <p className="px-2 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-subtle uppercase">{group.section}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link to={item.to} onClick={onNavigate} className={cn("flex h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg")}>
                    <Icon className={cn("size-4", active ? "text-primary" : "text-subtle")} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-3 py-3">
      <CowMark className="size-8 text-primary" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-medium tracking-tight">Bossnu.Silelo</span>
        <span className="text-[11px] text-subtle">AI Agent Console</span>
      </span>
    </Link>
  );
}

export function AppShell({ children, crumb }: { children: ReactNode; crumb?: string }) {
  const navOpen = useCowStore((s) => s.navOpen);
  const setNavOpen = useCowStore((s) => s.setNavOpen);
  const newSession = useCowStore((s) => s.newSession);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const unsub = useCowStore.persist.onFinishHydration(() => {
      useCowStore.getState().setHydrated();
    });
    void useCowStore.persist.rehydrate();
    return unsub;
  }, []);

  const title = crumb ?? NAV.flatMap((g) => g.items).find((i) => (i.to === "/" ? pathname === "/" : pathname.startsWith(i.to)))?.label ?? "Chat";

  return (
    <div className="flex h-dvh min-h-0 bg-bg text-fg">
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <Brand />
        <NavBody />
        <div className="flex items-center gap-2 border-t border-border px-3 py-3">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="font-mono text-[11px] text-subtle">Bossnu.Silelo</span>
        </div>
      </aside>

      <Sheet open={navOpen} onOpenChange={setNavOpen} title="Navigation">
        <Brand />
        <NavBody onNavigate={() => setNavOpen(false)} />
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 pr-16 md:px-4 md:pr-4">
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            {navOpen ? <X /> : <Menu />}
          </Button>
          <p className="min-w-0 truncate text-sm text-muted">
            <span className="hidden sm:inline">Bossnu.Silelo</span>
            <span className="hidden text-subtle sm:inline"> / </span>
            <span className="text-fg">{title}</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <UserButton />
            {pathname === "/" ? (
              <>
                <Button variant="secondary" size="icon-sm" className="sm:hidden" aria-label="New Chat" onClick={() => newSession()}>
                  <Plus className="size-3.5" />
                </Button>
                <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => newSession()}>
                  <Plus className="size-3.5" />
                  New Chat
                </Button>
              </>
            ) : null}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden pb-14 md:pb-0">{children}</div>

        <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-border bg-sidebar/95 md:hidden">
          {MOBILE_TABS.map((tab) => {
            const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
            const Icon = tab.icon;
            return (
              <Link key={tab.to} to={tab.to} className={cn("flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px]", active ? "text-primary" : "text-muted")}>
                <Icon className="size-5" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

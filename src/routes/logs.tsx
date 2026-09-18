import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useCowStore } from "@/lib/cow/store";
import { cn, formatStamp } from "@/lib/utils";

export const Route = createFileRoute("/logs")({ component: LogsPage });

function LogsPage() {
  const logs = useCowStore((s) => s.logs);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Logs" description="Agent runs, tools, and console events." />
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-8 sm:px-6">
        <ol className="space-y-px rounded-lg bg-surface py-1 font-mono text-xs shadow-[var(--shadow-border)]">
          {logs.map((l) => (
            <li key={l.id} className="flex gap-3 px-3 py-1.5">
              <span className="shrink-0 text-subtle tabular-nums">{formatStamp(l.at)}</span>
              <span
                className={cn(
                  "w-12 shrink-0 uppercase",
                  l.level === "error" ? "text-danger" : l.level === "tool" ? "text-primary" : "text-muted",
                )}
              >
                {l.level}
              </span>
              <span className="w-16 shrink-0 text-subtle">{l.source}</span>
              <span className="min-w-0 text-fg">{l.message}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

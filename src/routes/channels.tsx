import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCowStore } from "@/lib/cow/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/channels")({ component: ChannelsPage });

function ChannelsPage() {
  const channels = useCowStore((s) => s.channels);
  const connect = useCowStore((s) => s.connectChannel);

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        title="Channels"
        description="The Web console is live. Other messengers can be marked connected for a local team view — they do not leave this browser."
      />
      <ul className="mx-4 mb-8 divide-y divide-border overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] sm:mx-6">
        {channels.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span
              className={cn(
                "size-2 rounded-full",
                c.status === "connected" ? "bg-primary" : c.status === "available" ? "bg-warn" : "bg-subtle",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted">{c.summary}</p>
            </div>
            <Button size="sm" variant={c.status === "connected" ? "secondary" : "outline"} onClick={() => connect(c.id)}>
              {c.status === "connected" ? "Connected" : "Mark connected"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

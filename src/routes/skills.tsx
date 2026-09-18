import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCowStore } from "@/lib/cow/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skills")({ component: SkillsPage });

function SkillsPage() {
  const skills = useCowStore((s) => s.skills);
  const toggle = useCowStore((s) => s.toggleSkill);
  const installed = skills.filter((s) => s.installed).length;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <PageHeader
        title="Skills"
        description="Playbooks the agent loads before it plans. Install from the hub or keep builtins on."
        actions={
          <span className="text-xs text-muted tabular-nums">
            {installed} / {skills.length} installed
          </span>
        }
      />
      <div className="grid gap-3 px-4 pb-8 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
        {skills.map((s) => (
          <article
            key={s.id}
            className="flex flex-col rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-elevated text-primary">
                <Zap className="size-4" />
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  s.source === "builtin" ? "bg-primary/15 text-primary" : "bg-elevated text-muted",
                )}
              >
                {s.source}
              </span>
            </div>
            <h2 className="mt-3 text-sm font-medium">{s.name}</h2>
            <p className="mt-1 text-xs text-subtle">{s.category}</p>
            <p className="mt-2 flex-1 text-sm text-muted">{s.summary}</p>
            <Button
              className="mt-4"
              variant={s.installed ? "secondary" : "default"}
              size="sm"
              onClick={() => toggle(s.id)}
            >
              {s.installed ? "Installed" : "Install"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

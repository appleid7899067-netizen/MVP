import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { MODELS_STATIC, useCowStore } from "@/lib/cow/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({ component: ModelsPage });

function ModelsPage() {
  const selected = useCowStore((s) => s.selectedModelId);
  const setModel = useCowStore((s) => s.setModel);

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        title="Models"
        description="This demo’s live path is xAI grok-4.5. Other providers are listed as they appear in the CowAgent catalog."
      />
      <div className="grid gap-3 px-4 pb-8 sm:grid-cols-2 sm:px-6">
        {MODELS_STATIC.map((m) => (
          <article
            key={m.id}
            className={cn(
              "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
              selected === m.id && "ring-1 ring-primary",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{m.provider}</p>
                <h2 className="mt-0.5 font-mono text-sm font-medium">{m.name}</h2>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  m.live ? "bg-primary/15 text-primary" : "bg-elevated text-subtle",
                )}
              >
                {m.live ? "Live" : "Catalog"}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">{m.modalities.join(" · ")}</p>
            <Button
              className="mt-4"
              size="sm"
              variant={selected === m.id ? "secondary" : "outline"}
              disabled={!m.live}
              onClick={() => setModel(m.id)}
            >
              {m.live ? (selected === m.id ? "Selected" : "Use model") : "Not connected"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

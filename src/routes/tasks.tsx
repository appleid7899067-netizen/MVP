import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCowStore } from "@/lib/cow/store";
import { cn, formatStamp, uid } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

function TasksPage() {
  const tasks = useCowStore((s) => s.tasks);
  const toggle = useCowStore((s) => s.toggleTask);
  const addTask = useCowStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [cadence, setCadence] = useState("Daily 09:00");

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        title="Tasks"
        description="Scheduled jobs the agent can pick up — Deep Dream, briefs, follow-ups."
      />
      <form
        className="mx-4 mb-4 flex flex-col gap-2 rounded-lg bg-surface p-3 shadow-[var(--shadow-border)] sm:mx-6 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addTask({
            id: uid(),
            title: title.trim(),
            cadence,
            notes: "",
            enabled: true,
            nextRun: new Date().toISOString(),
          });
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="h-10 flex-1 rounded-md bg-elevated px-3 text-sm outline-none"
        />
        <input
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
          placeholder="Cadence"
          className="h-10 w-full rounded-md bg-elevated px-3 text-sm outline-none sm:w-40"
        />
        <Button type="submit" size="sm" className="h-10">
          Add
        </Button>
      </form>
      <ul className="mx-4 mb-8 space-y-2 sm:mx-6">
        {tasks.map((t) => (
          <li
            key={t.id}
            className={cn(
              "flex flex-wrap items-center gap-3 rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
              !t.enabled && "opacity-60",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted">
                {t.cadence}
                <span className="text-subtle"> · next {formatStamp(t.nextRun)}</span>
              </p>
              {t.notes ? <p className="mt-1 text-xs text-subtle">{t.notes}</p> : null}
            </div>
            <Button size="sm" variant={t.enabled ? "secondary" : "outline"} onClick={() => toggle(t.id)}>
              {t.enabled ? "On" : "Off"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

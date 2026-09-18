import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Code2,
  LifeBuoy,
  PenLine,
  Search,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCowStore } from "@/lib/cow/store";
import { cn, uid } from "@/lib/utils";

export const Route = createFileRoute("/agents")({ component: AgentsPage });

const ICONS = {
  shield: Shield,
  search: Search,
  pen: PenLine,
  "life-buoy": LifeBuoy,
  chart: BarChart3,
  code: Code2,
} as const;

function AgentsPage() {
  const agents = useCowStore((s) => s.agents);
  const activeAgentId = useCowStore((s) => s.activeAgentId);
  const setActiveAgent = useCowStore((s) => s.setActiveAgent);
  const upsertAgent = useCowStore((s) => s.upsertAgent);
  const newSession = useCowStore((s) => s.newSession);
  const skills = useCowStore((s) => s.skills);
  const navigate = useNavigate();
  const [sel, setSel] = useState(activeAgentId);
  const agent = agents.find((a) => a.id === sel) ?? agents[0];
  const Icon = ICONS[agent.icon as keyof typeof ICONS] ?? Shield;

  function startChat() {
    setActiveAgent(agent.id);
    newSession();
    void navigate({ to: "/" });
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader title="Agents" description="A team with separate roles, skills, and memory." />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="w-full shrink-0 overflow-y-auto border-b border-border p-3 md:w-64 md:border-r md:border-b-0">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm font-medium">Agent Team</p>
            <Button
              size="sm"
              onClick={() => {
                const id = uid();
                upsertAgent({
                  id,
                  name: "New Agent",
                  title: "Specialist",
                  role: "Custom",
                  icon: "search",
                  skillIds: [],
                  instructions: "You are a specialist on the CowAgent team. Be precise and use tools.",
                });
                setSel(id);
              }}
            >
              New Agent
            </Button>
          </div>
          <ul className="flex flex-col gap-1">
            {agents.map((a) => {
              const Ic = ICONS[a.icon as keyof typeof ICONS] ?? Shield;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSel(a.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md px-2 py-2 text-left",
                      a.id === sel ? "bg-elevated" : "hover:bg-elevated/50",
                    )}
                  >
                    <span className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-surface text-primary shadow-[var(--shadow-border)]">
                      <Ic className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{a.name}</span>
                        {a.isDefault ? (
                          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">
                            Default
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate text-xs text-muted">{a.title} · {a.role}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-elevated text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-medium tracking-tight">{agent.name}</h2>
              <p className="text-sm text-muted">{agent.title}</p>
            </div>
          </div>

          <label className="mt-6 block text-xs font-medium text-muted">
            Name
            <input
              value={agent.name}
              onChange={(e) => upsertAgent({ ...agent, name: e.target.value })}
              className="mt-1 h-10 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            />
          </label>
          <label className="mt-4 block text-xs font-medium text-muted">
            Responsibilities
            <textarea
              value={agent.instructions}
              onChange={(e) => upsertAgent({ ...agent, instructions: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded-md bg-elevated px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            />
          </label>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Skills</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((s) => {
                const on = agent.skillIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      upsertAgent({
                        ...agent,
                        skillIds: on ? agent.skillIds.filter((id) => id !== s.id) : [...agent.skillIds, s.id],
                      })
                    }
                    className={cn(
                      "h-8 rounded-full px-3 text-xs",
                      on ? "bg-primary text-primary-fg" : "bg-elevated text-muted",
                    )}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button onClick={startChat}>Start chat</Button>
            <Button variant="secondary" onClick={() => setActiveAgent(agent.id)}>
              Set active
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

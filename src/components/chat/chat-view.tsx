import {
  Check,
  ChevronDown,
  CircleAlert,
  Lightbulb,
  LoaderCircle,
  Plus,
  Send,
  Trash2,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Markdown } from "@/components/markdown";
import { CowMark } from "@/components/cow-mark";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { runAgent } from "@/lib/cow/agent-rpc";
import { useCowStore, sessionTitleFrom } from "@/lib/cow/store";
import type { ChatMessage, ToolTrace } from "@/lib/cow/types";
import { cn, formatClock, relativeDay, sleep, uid } from "@/lib/utils";

const SUGGESTIONS = [
  "Compare ReAct, function calling, MCP, and tool use in a table.",
  "What is stored in my long-term memory?",
  "Distill today's chat into a knowledge page.",
  "Plan a weekly research routine and schedule it.",
];

function TraceRow({ t }: { t: ToolTrace }) {
  const [open, setOpen] = useState(false);
  const ok = t.status === "ok";
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-muted hover:text-fg"
      >
        {t.kind === "thought" ? (
          <Lightbulb className="size-3.5 text-warn" />
        ) : t.status === "running" ? (
          <LoaderCircle className="size-3.5 animate-spin text-primary" />
        ) : ok ? (
          <Check className="size-3.5 text-primary" />
        ) : (
          <CircleAlert className="size-3.5 text-danger" />
        )}
        <span className="font-mono">{t.name}</span>
        {t.durationMs != null ? (
          <span className="text-subtle tabular-nums">{(t.durationMs / 1000).toFixed(2)}s</span>
        ) : null}
        <ChevronDown className={cn("ml-auto size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (t.detail || t.output) ? (
        <pre className="max-h-40 overflow-auto px-3 pb-2 font-mono text-[11px] leading-relaxed text-subtle">
          {[t.detail, t.output].filter(Boolean).join("\n\n")}
        </pre>
      ) : null}
    </div>
  );
}

function AssistantBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex max-w-3xl gap-3">
      <CowMark className="mt-1 size-8 shrink-0 text-primary" />
      <div className="min-w-0 flex-1 rounded-lg bg-surface px-1 py-1 shadow-[var(--shadow-border)]">
        {msg.traces?.length ? (
          <div className="mb-1 overflow-hidden rounded-md bg-elevated/60">
            {msg.traces.map((t) => (
              <TraceRow key={t.id} t={t} />
            ))}
          </div>
        ) : null}
        {msg.pending && !msg.content ? (
          <p className="shimmer px-3 py-2 text-sm text-muted">Planning and calling tools…</p>
        ) : msg.content ? (
          <div className="px-3 py-2">
            <Markdown source={msg.content} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-lg rounded-lg bg-bubble px-4 py-2.5 text-sm leading-relaxed text-bubble-fg">
        {msg.content}
      </div>
    </div>
  );
}

function HistoryPanel({ onPick }: { onPick?: () => void }) {
  const sessions = useCowStore((s) => s.sessions);
  const active = useCowStore((s) => s.activeSessionId);
  const setActive = useCowStore((s) => s.setActiveSession);
  const newSession = useCowStore((s) => s.newSession);
  const deleteSession = useCowStore((s) => s.deleteSession);

  const groups = useMemo(() => {
    const map = new Map<string, typeof sessions>();
    for (const s of sessions) {
      const g = relativeDay(s.updatedAt);
      const list = map.get(g) ?? [];
      list.push(s);
      map.set(g, list);
    }
    return [...map.entries()];
  }, [sessions]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-surface">
      <div className="flex items-center justify-between px-3 py-3">
        <p className="text-sm font-medium">History</p>
      </div>
      <div className="px-3 pb-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            newSession();
            onPick?.();
          }}
        >
          <Plus className="size-3.5" />
          New Chat
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {groups.map(([label, list]) => (
          <div key={label} className="mb-3">
            <p className="px-2 pb-1 text-[10px] font-medium tracking-[0.12em] text-subtle uppercase">
              {label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {list.map((s) => (
                <li key={s.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(s.id);
                      onPick?.();
                    }}
                    className={cn(
                      "flex h-9 w-full items-center rounded-sm px-2 pr-8 text-left text-sm",
                      s.id === active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/50 hover:text-fg",
                    )}
                  >
                    <span className="truncate">{s.title}</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete chat"
                    onClick={() => deleteSession(s.id)}
                    className="absolute top-1 right-1 hidden size-7 items-center justify-center rounded-sm text-subtle hover:text-danger group-hover:flex"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatView() {
  const sessions = useCowStore((s) => s.sessions);
  const activeSessionId = useCowStore((s) => s.activeSessionId);
  const agents = useCowStore((s) => s.agents);
  const activeAgentId = useCowStore((s) => s.activeAgentId);
  const skills = useCowStore((s) => s.skills);
  const memoryFiles = useCowStore((s) => s.memoryFiles);
  const knowledgePages = useCowStore((s) => s.knowledgePages);
  const workspaceFiles = useCowStore((s) => s.workspaceFiles);
  const historyOpen = useCowStore((s) => s.historyOpen);
  const setHistoryOpen = useCowStore((s) => s.setHistoryOpen);
  const addMessage = useCowStore((s) => s.addMessage);
  const patchMessage = useCowStore((s) => s.patchMessage);
  const applyPatches = useCowStore((s) => s.applyPatches);
  const renameSession = useCowStore((s) => s.renameSession);
  const addLog = useCowStore((s) => s.addLog);
  const setActiveAgent = useCowStore((s) => s.setActiveAgent);

  const session = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const agent = agents.find((a) => a.id === activeAgentId) ?? agents[0];
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);
  const [mobileHistory, setMobileHistory] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [session?.messages.length, session?.messages.at(-1)?.content, session?.messages.at(-1)?.traces?.length]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || !session) return;
    setDraft("");
    setError(null);
    setBusy(true);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(session.id, userMsg);
    if (session.title === "New Chat") renameSession(session.id, sessionTitleFrom(content));

    const asstId = uid();
    const running: ChatMessage = {
      id: asstId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      pending: true,
      traces: [{ id: uid(), kind: "thought", name: "Thought", status: "running", detail: "Reading context…" }],
    };
    addMessage(session.id, running);

    const history = [...session.messages, userMsg]
      .filter((m) => m.role === "user" || (m.role === "assistant" && m.content))
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    const installed = skills.filter((s) => s.installed);
    const isDream = /^\/(dream|remember)\b/i.test(content) || /deep dream|distill.*(memory|today)/i.test(content);

    try {
      const result = await runAgent({
        data: {
          mode: isDream ? "dream" : "chat",
          messages: history,
          agent: {
            name: agent.name,
            title: agent.title,
            instructions: agent.instructions,
          },
          memory: memoryFiles.map((m) => ({ filename: m.filename, kind: m.kind, content: m.content })),
          knowledge: knowledgePages.map((p) => ({
            title: p.title,
            kind: p.kind,
            tags: p.tags,
            content: p.content,
          })),
          workspace: workspaceFiles.map((f) => ({ path: f.path, content: f.content })),
          skills: installed.map((s) => ({ name: s.name, instructions: s.instructions })),
        },
      });

      if (!result.ok) {
        patchMessage(session.id, asstId, {
          pending: false,
          traces: [],
          content: result.error,
        });
        setError(result.error);
        addLog({ level: "error", source: "agent", message: result.error });
        return;
      }

      const traces = result.traces;
      for (let i = 0; i < traces.length; i++) {
        patchMessage(session.id, asstId, { traces: traces.slice(0, i + 1), pending: true });
        await sleep(90);
      }
      patchMessage(session.id, asstId, {
        pending: false,
        traces,
        content: result.content,
        createdAt: new Date().toISOString(),
      });
      applyPatches(result.patches);
      addLog({
        level: "info",
        source: agent.name,
        message: `Completed turn with ${traces.filter((t) => t.kind === "tool").length} tool calls.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Agent run failed.";
      patchMessage(session.id, asstId, { pending: false, traces: [], content: msg });
      setError(msg);
      addLog({ level: "error", source: "agent", message: msg });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  }

  const empty = !session?.messages.length;

  return (
    <div className="flex h-full min-h-0">
      <Sheet open={mobileHistory} onOpenChange={setMobileHistory} title="History">
        <HistoryPanel onPick={() => setMobileHistory(false)} />
      </Sheet>
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border lg:flex",
          historyOpen ? "w-56" : "w-0 overflow-hidden border-0",
        )}
      >
        <HistoryPanel />
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3 text-xs text-muted">
          <button
            type="button"
            className="rounded-sm px-1.5 py-1 hover:bg-elevated hover:text-fg"
            onClick={() => {
              if (window.matchMedia("(min-width: 1024px)").matches) setHistoryOpen(!historyOpen);
              else setMobileHistory(true);
            }}
          >
            History
          </button>
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => setAgentOpen((v) => !v)}
              className="flex h-8 max-w-48 items-center gap-1.5 truncate rounded-sm px-1.5 hover:bg-elevated hover:text-fg"
            >
              <Wrench className="size-3.5 shrink-0 text-subtle" />
              <span className="truncate text-fg">
                {agent.name} · {agent.title}
              </span>
            </button>
            {agentOpen ? (
              <ul className="absolute top-9 left-0 z-20 w-56 overflow-hidden rounded-md bg-elevated py-1 shadow-[var(--shadow-border)]">
                {agents.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAgent(a.id);
                        setAgentOpen(false);
                      }}
                      className={cn(
                        "flex h-9 w-full items-center px-3 text-left text-sm",
                        a.id === agent.id ? "text-primary" : "text-fg hover:bg-surface",
                      )}
                    >
                      {a.name} · {a.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <span className="ml-auto hidden font-mono text-2xs text-subtle sm:inline">Puter AI live</span>
        </div>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
          {empty ? (
            <div className="mx-auto flex max-w-lg flex-col items-center pt-10 text-center sm:pt-16">
              <CowMark className="size-14 text-primary" />
              <h1 className="mt-4 text-2xl font-medium tracking-tight">How can I help?</h1>
              <p className="mt-2 text-sm text-muted">
                {agent.name} plans tasks, searches memory and the wiki, and writes knowledge back.
              </p>
              <ul className="mt-6 grid w-full gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void send(s)}
                      className="w-full rounded-md bg-surface px-3 py-3 text-left text-sm text-muted shadow-[var(--shadow-border)] transition-colors hover:text-fg"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {session.messages.map((m) =>
                m.role === "user" ? <UserBubble key={m.id} msg={m} /> : <AssistantBubble key={m.id} msg={m} />,
              )}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border px-3 py-3 sm:px-6">
          {error ? <p className="mb-2 text-xs text-danger">{error}</p> : null}
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-lg bg-elevated p-2 shadow-[var(--shadow-border)]">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Type a message, or ask to search memory"
              className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fg outline-none placeholder:text-subtle"
              disabled={busy}
            />
            <Button type="submit" size="icon" disabled={busy || !draft.trim()} aria-label="Send">
              {busy ? <LoaderCircle className="animate-spin" /> : <Send />}
            </Button>
          </div>
          {session?.messages.length ? (
            <p className="mx-auto mt-1.5 max-w-3xl text-right font-mono text-[11px] text-subtle tabular-nums">
              {formatClock(session.updatedAt)}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}

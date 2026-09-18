import { createFileRoute } from "@tanstack/react-router";
import { Network, Files } from "lucide-react";
import { useMemo, useState } from "react";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useCowStore } from "@/lib/cow/store";
import type { KnowledgeKind, KnowledgePage } from "@/lib/cow/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge")({ component: KnowledgePage });

const KIND_COLOR: Record<KnowledgeKind, string> = {
  concept: "var(--color-info)",
  source: "var(--color-warn)",
  entity: "var(--color-entity)",
};

function layout(pages: KnowledgePage[]) {
  const w = 900;
  const h = 560;
  const groups: KnowledgeKind[] = ["concept", "entity", "source"];
  return pages.map((p, i) => {
    const g = groups.indexOf(p.kind);
    const inG = pages.filter((x) => x.kind === p.kind);
    const j = inG.findIndex((x) => x.id === p.id);
    const ring = 150 + g * 70;
    const angle = (j / Math.max(inG.length, 1)) * Math.PI * 2 + g * 0.4;
    const cx = w / 2 + Math.cos(angle) * ring + (i % 3) * 6;
    const cy = h / 2 + Math.sin(angle) * ring * 0.72;
    return { ...p, x: cx, y: cy };
  });
}

function Graph({
  pages,
  selected,
  onSelect,
}: {
  pages: KnowledgePage[];
  selected: string | undefined;
  onSelect: (id: string) => void;
}) {
  const nodes = useMemo(() => layout(pages), [pages]);
  const edges = useMemo(() => {
    const out: { a: string; b: string }[] = [];
    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const shared = pages[i].tags.filter((t) => pages[j].tags.includes(t));
        if (shared.length) out.push({ a: pages[i].id, b: pages[j].id });
      }
    }
    return out;
  }, [pages]);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]">
      <svg viewBox="0 0 900 560" className="size-full">
        {edges.map((e) => {
          const a = byId[e.a];
          const b = byId[e.b];
          if (!a || !b) return null;
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="currentColor"
              className="text-border-strong"
              strokeWidth="1"
            />
          );
        })}
        {nodes.map((n) => {
          const r = n.id === selected ? 16 : 11;
          return (
            <g key={n.id} onClick={() => onSelect(n.id)} className="cursor-pointer">
              <circle cx={n.x} cy={n.y} r={r} fill={KIND_COLOR[n.kind]} />
              <text
                x={n.x + 14}
                y={n.y + 4}
                fill="currentColor"
                className="text-muted"
                fontSize="11"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {n.title.length > 18 ? `${n.title.slice(0, 18)}…` : n.title}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="absolute top-3 right-3 flex gap-3 text-2xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-info" /> concepts
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-warn" /> sources
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-entity" /> entities
        </span>
      </div>
    </div>
  );
}

function KnowledgePage() {
  const pages = useCowStore((s) => s.knowledgePages);
  const [mode, setMode] = useState<"docs" | "graph">("graph");
  const [sel, setSel] = useState(pages[0]?.id);
  const [q, setQ] = useState("");
  const filtered = pages.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.tags.some((t) => t.includes(q.toLowerCase())),
  );
  const page = pages.find((p) => p.id === sel) ?? filtered[0];
  const bytes = pages.reduce((n, p) => n + p.content.length, 0);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Knowledge"
        description="Auto-curated Markdown wiki plus a graph of shared tags."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted tabular-nums sm:inline">
              {pages.length} pages · {(bytes / 1024).toFixed(1)} KB
            </span>
            <Button size="sm" variant={mode === "docs" ? "secondary" : "ghost"} onClick={() => setMode("docs")}>
              <Files className="size-3.5" />
              Documents
            </Button>
            <Button size="sm" variant={mode === "graph" ? "secondary" : "ghost"} onClick={() => setMode("graph")}>
              <Network className="size-3.5" />
              Graph
            </Button>
          </div>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6">
          {mode === "graph" ? (
            <Graph pages={pages} selected={sel} onSelect={setSel} />
          ) : (
            <div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter pages"
                className="mb-3 h-10 w-full rounded-md bg-elevated px-3 text-sm shadow-[var(--shadow-border)] outline-none"
              />
              <ul className="grid gap-2 sm:grid-cols-2">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSel(p.id)}
                      className={cn(
                        "h-full w-full rounded-md bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)]",
                        page?.id === p.id && "ring-1 ring-primary",
                      )}
                    >
                      <span className="text-sm font-medium">{p.title}</span>
                      <span className="mt-1 block text-xs text-muted capitalize">{p.kind}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {page ? (
          <aside className="min-h-0 w-full overflow-y-auto border-t border-border p-4 lg:w-[26rem] lg:border-t-0 lg:border-l">
            <p className="text-xs text-subtle capitalize">{page.kind}</p>
            <h2 className="mt-1 text-base font-medium">{page.title}</h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {page.tags.map((t) => (
                <span key={t} className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-muted">
                  {t}
                </span>
              ))}
            </div>
            <Markdown source={page.content} className="mt-3" />
          </aside>
        ) : null}
      </div>
    </div>
  );
}

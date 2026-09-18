import { createFileRoute } from "@tanstack/react-router";
import { Moon, FileText } from "lucide-react";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { runAgent } from "@/lib/cow/agent-rpc";
import { useCowStore } from "@/lib/cow/store";
import { cn, formatBytes, formatStamp, byteLen } from "@/lib/utils";

export const Route = createFileRoute("/memory")({ component: MemoryPage });

function MemoryPage() {
  const files = useCowStore((s) => s.memoryFiles);
  const applyPatches = useCowStore((s) => s.applyPatches);
  const addLog = useCowStore((s) => s.addLog);
  const sessions = useCowStore((s) => s.sessions);
  const agent = useCowStore((s) => s.agents.find((a) => a.id === s.activeAgentId) ?? s.agents[0]);
  const skills = useCowStore((s) => s.skills);
  const knowledgePages = useCowStore((s) => s.knowledgePages);
  const workspaceFiles = useCowStore((s) => s.workspaceFiles);
  const [tab, setTab] = useState<"files" | "dream">("files");
  const [sel, setSel] = useState(files[0]?.id);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const visible = tab === "dream" ? files.filter((f) => f.kind === "dream") : files;
  const file = files.find((f) => f.id === sel) ?? visible[0];

  async function dream() {
    setBusy(true);
    setNote(null);
    const recent = sessions[0]?.messages.slice(-6).map((m) => ({ role: m.role, content: m.content })) ?? [];
    try {
      const result = await runAgent({
        data: {
          mode: "dream",
          messages: [
            ...recent,
            {
              role: "user",
              content: "Run Deep Dream. Distill core memory and write DREAM.md for today.",
            },
          ],
          agent: { name: agent.name, title: agent.title, instructions: agent.instructions },
          memory: files.map((m) => ({ filename: m.filename, kind: m.kind, content: m.content })),
          knowledge: knowledgePages.map((p) => ({
            title: p.title,
            kind: p.kind,
            tags: p.tags,
            content: p.content,
          })),
          workspace: workspaceFiles.map((f) => ({ path: f.path, content: f.content })),
          skills: skills.filter((s) => s.installed).map((s) => ({ name: s.name, instructions: s.instructions })),
        },
      });
      if (!result.ok) {
        setNote(result.error);
      } else {
        applyPatches(result.patches);
        addLog({ level: "info", source: "dream", message: "Deep Dream distilled memory." });
        setNote(result.content);
        setTab("dream");
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Dream failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Memory"
        description="Three tiers: session context, daily notes, and core MEMORY.md. Deep Dream distills upward."
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={tab === "files" ? "secondary" : "ghost"}
              onClick={() => setTab("files")}
            >
              <FileText className="size-3.5" />
              Memory Files
            </Button>
            <Button
              size="sm"
              variant={tab === "dream" ? "secondary" : "ghost"}
              onClick={() => setTab("dream")}
            >
              <Moon className="size-3.5" />
              Dream Diary
            </Button>
            <Button size="sm" onClick={() => void dream()} disabled={busy}>
              {busy ? "Dreaming…" : "Run Deep Dream"}
            </Button>
          </div>
        }
      />
      {note ? <p className="px-4 pb-2 text-xs text-muted sm:px-6">{note}</p> : null}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 sm:px-6">
          <div className="overflow-hidden rounded-lg shadow-[var(--shadow-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-elevated text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Filename</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Size</th>
                  <th className="hidden px-3 py-2 font-medium sm:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSel(f.id)}
                    className={cn(
                      "cursor-pointer border-t border-border",
                      file?.id === f.id ? "bg-elevated" : "hover:bg-elevated/40",
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-xs">{f.filename}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px]",
                          f.kind === "global"
                            ? "bg-primary/15 text-primary"
                            : f.kind === "dream"
                              ? "bg-info/20 text-info"
                              : "bg-elevated text-muted",
                        )}
                      >
                        {f.kind === "global" ? "Global" : f.kind === "dream" ? "Dream" : "Daily"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted tabular-nums">{formatBytes(byteLen(f.content))}</td>
                    <td className="hidden px-3 py-2 font-mono text-xs text-subtle sm:table-cell">
                      {formatStamp(f.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {file ? (
          <aside className="min-h-0 w-full overflow-y-auto border-t border-border p-4 lg:w-[28rem] lg:border-t-0 lg:border-l">
            <p className="font-mono text-xs text-subtle">{file.filename}</p>
            <Markdown source={file.content} className="mt-2" />
          </aside>
        ) : null}
      </div>
    </div>
  );
}

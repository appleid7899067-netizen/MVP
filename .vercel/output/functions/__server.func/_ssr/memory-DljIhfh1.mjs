import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatStamp, n as cn, r as formatBytes, t as byteLen } from "./utils-dvwzML2A.mjs";
import { S as FileText, h as Moon } from "../_libs/lucide-react.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
import { t as Markdown } from "./markdown-NyZiBx-P.mjs";
import { t as runAgent } from "./agent-rpc-DJtNOJ44.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memory-DljIhfh1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MemoryPage() {
	const files = useCowStore((s) => s.memoryFiles);
	const applyPatches = useCowStore((s) => s.applyPatches);
	const addLog = useCowStore((s) => s.addLog);
	const sessions = useCowStore((s) => s.sessions);
	const agent = useCowStore((s) => s.agents.find((a) => a.id === s.activeAgentId) ?? s.agents[0]);
	const skills = useCowStore((s) => s.skills);
	const knowledgePages = useCowStore((s) => s.knowledgePages);
	const workspaceFiles = useCowStore((s) => s.workspaceFiles);
	const [tab, setTab] = (0, import_react.useState)("files");
	const [sel, setSel] = (0, import_react.useState)(files[0]?.id);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const visible = tab === "dream" ? files.filter((f) => f.kind === "dream") : files;
	const file = files.find((f) => f.id === sel) ?? visible[0];
	async function dream() {
		setBusy(true);
		setNote(null);
		const recent = sessions[0]?.messages.slice(-6).map((m) => ({
			role: m.role,
			content: m.content
		})) ?? [];
		try {
			const result = await runAgent({ data: {
				mode: "dream",
				messages: [...recent, {
					role: "user",
					content: "Run Deep Dream. Distill core memory and write DREAM.md for today."
				}],
				agent: {
					name: agent.name,
					title: agent.title,
					instructions: agent.instructions
				},
				memory: files.map((m) => ({
					filename: m.filename,
					kind: m.kind,
					content: m.content
				})),
				knowledge: knowledgePages.map((p) => ({
					title: p.title,
					kind: p.kind,
					tags: p.tags,
					content: p.content
				})),
				workspace: workspaceFiles.map((f) => ({
					path: f.path,
					content: f.content
				})),
				skills: skills.filter((s) => s.installed).map((s) => ({
					name: s.name,
					instructions: s.instructions
				}))
			} });
			if (!result.ok) setNote(result.error);
			else {
				applyPatches(result.patches);
				addLog({
					level: "info",
					source: "dream",
					message: "Deep Dream distilled memory."
				});
				setNote(result.content);
				setTab("dream");
			}
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Dream failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Memory",
				description: "Three tiers: session context, daily notes, and core MEMORY.md. Deep Dream distills upward.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: tab === "files" ? "secondary" : "ghost",
							onClick: () => setTab("files"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), "Memory Files"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: tab === "dream" ? "secondary" : "ghost",
							onClick: () => setTab("dream"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5" }), "Dream Diary"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void dream(),
							disabled: busy,
							children: busy ? "Dreaming…" : "Run Deep Dream"
						})
					]
				})
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-2 text-xs text-muted sm:px-6",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-auto px-4 pb-4 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-lg shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-elevated text-xs text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Filename"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-2 font-medium",
										children: "Size"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "hidden px-3 py-2 font-medium sm:table-cell",
										children: "Updated"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								onClick: () => setSel(f.id),
								className: cn("cursor-pointer border-t border-border", file?.id === f.id ? "bg-elevated" : "hover:bg-elevated/40"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs",
										children: f.filename
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded-full px-2 py-0.5 text-[10px]", f.kind === "global" ? "bg-primary/15 text-primary" : f.kind === "dream" ? "bg-info/20 text-info" : "bg-elevated text-muted"),
											children: f.kind === "global" ? "Global" : f.kind === "dream" ? "Dream" : "Daily"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 text-muted tabular-nums",
										children: formatBytes(byteLen(f.content))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "hidden px-3 py-2 font-mono text-xs text-subtle sm:table-cell",
										children: formatStamp(f.updatedAt)
									})
								]
							}, f.id)) })]
						})
					})
				}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-h-0 w-full overflow-y-auto border-t border-border p-4 lg:w-[28rem] lg:border-t-0 lg:border-l",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-subtle",
						children: file.filename
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
						source: file.content,
						className: "mt-2"
					})]
				}) : null]
			})
		]
	});
}
//#endregion
export { MemoryPage as component };

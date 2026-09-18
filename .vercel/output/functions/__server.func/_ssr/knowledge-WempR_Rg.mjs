import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-dvwzML2A.mjs";
import { m as Network, x as Files } from "../_libs/lucide-react.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
import { t as Markdown } from "./markdown-NyZiBx-P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/knowledge-WempR_Rg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_COLOR = {
	concept: "var(--color-info)",
	source: "var(--color-warn)",
	entity: "var(--color-entity)"
};
function layout(pages) {
	const w = 900;
	const h = 560;
	const groups = [
		"concept",
		"entity",
		"source"
	];
	return pages.map((p, i) => {
		const g = groups.indexOf(p.kind);
		const inG = pages.filter((x) => x.kind === p.kind);
		const j = inG.findIndex((x) => x.id === p.id);
		const ring = 150 + g * 70;
		const angle = j / Math.max(inG.length, 1) * Math.PI * 2 + g * .4;
		const cx = w / 2 + Math.cos(angle) * ring + i % 3 * 6;
		const cy = h / 2 + Math.sin(angle) * ring * .72;
		return {
			...p,
			x: cx,
			y: cy
		};
	});
}
function Graph({ pages, selected, onSelect }) {
	const nodes = (0, import_react.useMemo)(() => layout(pages), [pages]);
	const edges = (0, import_react.useMemo)(() => {
		const out = [];
		for (let i = 0; i < pages.length; i++) for (let j = i + 1; j < pages.length; j++) if (pages[i].tags.filter((t) => pages[j].tags.includes(t)).length) out.push({
			a: pages[i].id,
			b: pages[j].id
		});
		return out;
	}, [pages]);
	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-96 w-full overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 900 560",
			className: "size-full",
			children: [edges.map((e) => {
				const a = byId[e.a];
				const b = byId[e.b];
				if (!a || !b) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: a.x,
					y1: a.y,
					x2: b.x,
					y2: b.y,
					stroke: "currentColor",
					className: "text-border-strong",
					strokeWidth: "1"
				}, `${e.a}-${e.b}`);
			}), nodes.map((n) => {
				const r = n.id === selected ? 16 : 11;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					onClick: () => onSelect(n.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: n.x,
						cy: n.y,
						r,
						fill: KIND_COLOR[n.kind]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: n.x + 14,
						y: n.y + 4,
						fill: "currentColor",
						className: "text-muted",
						fontSize: "11",
						fontFamily: "IBM Plex Sans, sans-serif",
						children: n.title.length > 18 ? `${n.title.slice(0, 18)}…` : n.title
					})]
				}, n.id);
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-3 right-3 flex gap-3 text-2xs text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-info" }), " concepts"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-warn" }), " sources"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-entity" }), " entities"]
				})
			]
		})]
	});
}
function KnowledgePage() {
	const pages = useCowStore((s) => s.knowledgePages);
	const [mode, setMode] = (0, import_react.useState)("graph");
	const [sel, setSel] = (0, import_react.useState)(pages[0]?.id);
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = pages.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.tags.some((t) => t.includes(q.toLowerCase())));
	const page = pages.find((p) => p.id === sel) ?? filtered[0];
	const bytes = pages.reduce((n, p) => n + p.content.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Knowledge",
			description: "Auto-curated Markdown wiki plus a graph of shared tags.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden text-xs text-muted tabular-nums sm:inline",
						children: [
							pages.length,
							" pages · ",
							(bytes / 1024).toFixed(1),
							" KB"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: mode === "docs" ? "secondary" : "ghost",
						onClick: () => setMode("docs"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Files, { className: "size-3.5" }), "Documents"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: mode === "graph" ? "secondary" : "ghost",
						onClick: () => setMode("graph"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "size-3.5" }), "Graph"]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6",
				children: mode === "graph" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Graph, {
					pages,
					selected: sel,
					onSelect: setSel
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter pages",
					className: "mb-3 h-10 w-full rounded-md bg-elevated px-3 text-sm shadow-[var(--shadow-border)] outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 sm:grid-cols-2",
					children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSel(p.id),
						className: cn("h-full w-full rounded-md bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)]", page?.id === p.id && "ring-1 ring-primary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted capitalize",
							children: p.kind
						})]
					}) }, p.id))
				})] })
			}), page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "min-h-0 w-full overflow-y-auto border-t border-border p-4 lg:w-[26rem] lg:border-t-0 lg:border-l",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle capitalize",
						children: page.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-medium",
						children: page.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1",
						children: page.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-elevated px-2 py-0.5 text-[10px] text-muted",
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
						source: page.content,
						className: "mt-3"
					})
				]
			}) : null]
		})]
	});
}
var SplitComponent = KnowledgePage;
//#endregion
export { SplitComponent as component };

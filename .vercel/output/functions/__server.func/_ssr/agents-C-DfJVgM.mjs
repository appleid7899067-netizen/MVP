import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as uid, n as cn } from "./utils-dvwzML2A.mjs";
import { b as LifeBuoy, c as Shield, k as ChartColumn, p as PenLine, u as Search, w as CodeXml } from "../_libs/lucide-react.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-C-DfJVgM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	shield: Shield,
	search: Search,
	pen: PenLine,
	"life-buoy": LifeBuoy,
	chart: ChartColumn,
	code: CodeXml
};
function AgentsPage() {
	const agents = useCowStore((s) => s.agents);
	const activeAgentId = useCowStore((s) => s.activeAgentId);
	const setActiveAgent = useCowStore((s) => s.setActiveAgent);
	const upsertAgent = useCowStore((s) => s.upsertAgent);
	const newSession = useCowStore((s) => s.newSession);
	const skills = useCowStore((s) => s.skills);
	const navigate = useNavigate();
	const [sel, setSel] = (0, import_react.useState)(activeAgentId);
	const agent = agents.find((a) => a.id === sel) ?? agents[0];
	const Icon = ICONS[agent.icon] ?? Shield;
	function startChat() {
		setActiveAgent(agent.id);
		newSession();
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Agents",
			description: "A team with separate roles, skills, and memory."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "w-full shrink-0 overflow-y-auto border-b border-border p-3 md:w-64 md:border-r md:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Agent Team"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => {
							const id = uid();
							upsertAgent({
								id,
								name: "New Agent",
								title: "Specialist",
								role: "Custom",
								icon: "search",
								skillIds: [],
								instructions: "You are a specialist on the CowAgent team. Be precise and use tools."
							});
							setSel(id);
						},
						children: "New Agent"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-1",
					children: agents.map((a) => {
						const Ic = ICONS[a.icon] ?? Shield;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSel(a.id),
							className: cn("flex w-full items-start gap-3 rounded-md px-2 py-2 text-left", a.id === sel ? "bg-elevated" : "hover:bg-elevated/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 flex size-9 items-center justify-center rounded-full bg-surface text-primary shadow-[var(--shadow-border)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-medium",
										children: a.name
									}), a.isDefault ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary",
										children: "Default"
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-muted",
									children: [
										a.title,
										" · ",
										a.role
									]
								})]
							})]
						}) }, a.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-4 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-12 items-center justify-center rounded-full bg-elevated text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium tracking-tight",
							children: agent.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: agent.title
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-6 block text-xs font-medium text-muted",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: agent.name,
							onChange: (e) => upsertAgent({
								...agent,
								name: e.target.value
							}),
							className: "mt-1 h-10 w-full rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-xs font-medium text-muted",
						children: ["Responsibilities", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: agent.instructions,
							onChange: (e) => upsertAgent({
								...agent,
								instructions: e.target.value
							}),
							rows: 5,
							className: "mt-1 w-full rounded-md bg-elevated px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted",
							children: "Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: skills.map((s) => {
								const on = agent.skillIds.includes(s.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => upsertAgent({
										...agent,
										skillIds: on ? agent.skillIds.filter((id) => id !== s.id) : [...agent.skillIds, s.id]
									}),
									className: cn("h-8 rounded-full px-3 text-xs", on ? "bg-primary text-primary-fg" : "bg-elevated text-muted"),
									children: s.name
								}, s.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: startChat,
							children: "Start chat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => setActiveAgent(agent.id),
							children: "Set active"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AgentsPage as component };

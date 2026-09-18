import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-dvwzML2A.mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skills-DXYWy5nW.js
var import_jsx_runtime = require_jsx_runtime();
function SkillsPage() {
	const skills = useCowStore((s) => s.skills);
	const toggle = useCowStore((s) => s.toggleSkill);
	const installed = skills.filter((s) => s.installed).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Skills",
			description: "Playbooks the agent loads before it plans. Install from the hub or keep builtins on.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted tabular-nums",
				children: [
					installed,
					" / ",
					skills.length,
					" installed"
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 px-4 pb-8 sm:grid-cols-2 sm:px-6 xl:grid-cols-3",
			children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex flex-col rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-9 items-center justify-center rounded-md bg-elevated text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full px-2 py-0.5 text-[10px] font-medium", s.source === "builtin" ? "bg-primary/15 text-primary" : "bg-elevated text-muted"),
							children: s.source
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-sm font-medium",
						children: s.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: s.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 flex-1 text-sm text-muted",
						children: s.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: s.installed ? "secondary" : "default",
						size: "sm",
						onClick: () => toggle(s.id),
						children: s.installed ? "Installed" : "Install"
					})
				]
			}, s.id))
		})]
	});
}
//#endregion
export { SkillsPage as component };

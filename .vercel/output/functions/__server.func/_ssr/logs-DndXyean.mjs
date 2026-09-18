import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatStamp, n as cn } from "./utils-dvwzML2A.mjs";
import { i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logs-DndXyean.js
var import_jsx_runtime = require_jsx_runtime();
function LogsPage() {
	const logs = useCowStore((s) => s.logs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Logs",
			description: "Agent runs, tools, and console events."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-auto px-4 pb-8 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-px rounded-lg bg-surface py-1 font-mono text-xs shadow-[var(--shadow-border)]",
				children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 px-3 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-subtle tabular-nums",
							children: formatStamp(l.at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("w-12 shrink-0 uppercase", l.level === "error" ? "text-danger" : l.level === "tool" ? "text-primary" : "text-muted"),
							children: l.level
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-16 shrink-0 text-subtle",
							children: l.source
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 text-fg",
							children: l.message
						})
					]
				}, l.id))
			})
		})]
	});
}
//#endregion
export { LogsPage as component };

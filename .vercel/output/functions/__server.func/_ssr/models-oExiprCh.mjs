import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-dvwzML2A.mjs";
import { a as Button, i as useCowStore, n as MODELS_STATIC } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/models-oExiprCh.js
var import_jsx_runtime = require_jsx_runtime();
function ModelsPage() {
	const selected = useCowStore((s) => s.selectedModelId);
	const setModel = useCowStore((s) => s.setModel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Models",
			description: "This demo’s live path is xAI grok-4.5. Other providers are listed as they appear in the CowAgent catalog."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 px-4 pb-8 sm:grid-cols-2 sm:px-6",
			children: MODELS_STATIC.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: cn("rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]", selected === m.id && "ring-1 ring-primary"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: m.provider
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-0.5 font-mono text-sm font-medium",
							children: m.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full px-2 py-0.5 text-[10px]", m.live ? "bg-primary/15 text-primary" : "bg-elevated text-subtle"),
							children: m.live ? "Live" : "Catalog"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: m.modalities.join(" · ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						size: "sm",
						variant: selected === m.id ? "secondary" : "outline",
						disabled: !m.live,
						onClick: () => setModel(m.id),
						children: m.live ? selected === m.id ? "Selected" : "Use model" : "Not connected"
					})
				]
			}, m.id))
		})]
	});
}
//#endregion
export { ModelsPage as component };

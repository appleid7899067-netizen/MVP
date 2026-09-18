import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./utils-dvwzML2A.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/channels-D7zt4fWm.js
var import_jsx_runtime = require_jsx_runtime();
function ChannelsPage() {
	const channels = useCowStore((s) => s.channels);
	const connect = useCowStore((s) => s.connectChannel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Channels",
			description: "The Web console is live. Other messengers can be marked connected for a local team view — they do not leave this browser."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-4 mb-8 divide-y divide-border overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] sm:mx-6",
			children: channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", c.status === "connected" ? "bg-primary" : c.status === "available" ? "bg-warn" : "bg-subtle") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: c.summary
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: c.status === "connected" ? "secondary" : "outline",
						onClick: () => connect(c.id),
						children: c.status === "connected" ? "Connected" : "Mark connected"
					})
				]
			}, c.id))
		})]
	});
}
//#endregion
export { ChannelsPage as component };

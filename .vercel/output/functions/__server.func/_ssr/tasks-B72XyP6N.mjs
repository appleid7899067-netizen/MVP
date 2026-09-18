import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as formatStamp, c as uid, n as cn } from "./utils-dvwzML2A.mjs";
import { a as Button, i as useCowStore } from "./router-Dlv1kSmr.mjs";
import { t as PageHeader } from "./page-header-DcCzdZNW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-B72XyP6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const tasks = useCowStore((s) => s.tasks);
	const toggle = useCowStore((s) => s.toggleTask);
	const addTask = useCowStore((s) => s.addTask);
	const [title, setTitle] = (0, import_react.useState)("");
	const [cadence, setCadence] = (0, import_react.useState)("Daily 09:00");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Tasks",
				description: "Scheduled jobs the agent can pick up — Deep Dream, briefs, follow-ups."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-4 mb-4 flex flex-col gap-2 rounded-lg bg-surface p-3 shadow-[var(--shadow-border)] sm:mx-6 sm:flex-row",
				onSubmit: (e) => {
					e.preventDefault();
					if (!title.trim()) return;
					addTask({
						id: uid(),
						title: title.trim(),
						cadence,
						notes: "",
						enabled: true,
						nextRun: (/* @__PURE__ */ new Date()).toISOString()
					});
					setTitle("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Task title",
						className: "h-10 flex-1 rounded-md bg-elevated px-3 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: cadence,
						onChange: (e) => setCadence(e.target.value),
						placeholder: "Cadence",
						className: "h-10 w-full rounded-md bg-elevated px-3 text-sm outline-none sm:w-40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						className: "h-10",
						children: "Add"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mx-4 mb-8 space-y-2 sm:mx-6",
				children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("flex flex-wrap items-center gap-3 rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)]", !t.enabled && "opacity-60"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [t.cadence, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-subtle",
									children: [" · next ", formatStamp(t.nextRun)]
								})]
							}),
							t.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: t.notes
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: t.enabled ? "secondary" : "outline",
						onClick: () => toggle(t.id),
						children: t.enabled ? "On" : "Off"
					})]
				}, t.id))
			})
		]
	});
}
//#endregion
export { TasksPage as component };

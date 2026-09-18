import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogTitle, i as DialogPortal, n as DialogContent, o as Slot, r as DialogOverlay, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as uid, n as cn } from "./utils-dvwzML2A.mjs";
import { A as Brain, C as Cpu, T as Clock, _ as Menu, a as TriangleAlert, d as Radio, f as Plus, g as MessageSquare, i as Users, j as BookOpen, n as X, s as Terminal, t as Zap } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dlv1kSmr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function CowMark({ className, title = "CowAgent" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className: cn("shrink-0", className),
		role: "img",
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "32",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#fff",
				d: "M18.5 22.5c0-4.2 3.4-7.6 7.6-7.6h11.8c4.2 0 7.6 3.4 7.6 7.6v12.2c0 4.2-3.4 7.6-7.6 7.6H32l-8.2 6.4c-.7.55-1.7.05-1.7-.85v-5.55c-2.4-1.1-4.6-3.6-4.6-7.85V22.5Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "27.2",
				cy: "27.8",
				r: "2.35",
				fill: "#1a1a1a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "36.8",
				cy: "27.8",
				r: "2.35",
				fill: "#1a1a1a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M27.4 34.4c1.5 2.2 3.1 3.3 4.6 3.3s3.1-1.1 4.6-3.3",
				fill: "none",
				stroke: "#1a1a1a",
				strokeWidth: "2.1",
				strokeLinecap: "round"
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			outline: "text-fg shadow-[var(--shadow-border)] hover:bg-elevated",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			default: "h-10 rounded-md px-3.5 text-sm",
			sm: "h-8 rounded-sm px-2.5 text-xs",
			lg: "h-11 rounded-md px-4 text-sm",
			icon: "size-10 rounded-md",
			"icon-sm": "size-8 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Sheet({ open, onOpenChange, side = "left", children, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/70 data-[state=open]:animate-[fadein_150ms_ease-out]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"aria-describedby": void 0,
			className: cn("fixed top-0 z-50 flex h-full w-80 max-w-[88vw] flex-col bg-sidebar shadow-[var(--shadow-border)] outline-none", "data-[state=open]:animate-[panelin_250ms_var(--ease-out)]", side === "left" ? "left-0" : "right-0"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: title
			}), children]
		})] })
	});
}
var NAV = [
	{
		section: "Chat",
		items: [{
			to: "/",
			label: "Chat",
			icon: MessageSquare
		}]
	},
	{
		section: "Management",
		items: [
			{
				to: "/agents",
				label: "Agents",
				icon: Users
			},
			{
				to: "/models",
				label: "Models",
				icon: Cpu
			},
			{
				to: "/skills",
				label: "Skills",
				icon: Zap
			},
			{
				to: "/memory",
				label: "Memory",
				icon: Brain
			},
			{
				to: "/knowledge",
				label: "Knowledge",
				icon: BookOpen
			},
			{
				to: "/channels",
				label: "Channels",
				icon: Radio
			},
			{
				to: "/tasks",
				label: "Tasks",
				icon: Clock
			}
		]
	},
	{
		section: "Monitor",
		items: [{
			to: "/logs",
			label: "Logs",
			icon: Terminal
		}]
	}
];
var MOBILE_TABS = [
	{
		to: "/",
		label: "Chat",
		icon: MessageSquare
	},
	{
		to: "/agents",
		label: "Agents",
		icon: Users
	},
	{
		to: "/skills",
		label: "Skills",
		icon: Zap
	},
	{
		to: "/memory",
		label: "Memory",
		icon: Brain
	},
	{
		to: "/knowledge",
		label: "Knowledge",
		icon: BookOpen
	}
];
var T = {
	now: "2026-09-18T03:12:00.000Z",
	d1: "2026-09-17T18:40:00.000Z",
	d2: "2026-09-16T09:15:00.000Z",
	d3: "2026-09-11T11:08:00.000Z"
};
var AGENTS = [
	{
		id: "lead",
		name: "Cow",
		title: "Team Lead",
		role: "Orchestrator",
		icon: "shield",
		isDefault: true,
		skillIds: [
			"web-research",
			"memory-dream",
			"knowledge-wiki",
			"planner"
		],
		instructions: "You are Cow, the default CowAgent. Receive tasks, break them down, call tools, coordinate specialist skills, and return one consolidated reply. Prefer structured markdown (tables, headings) when comparing ideas."
	},
	{
		id: "research",
		name: "Scout",
		title: "Researcher",
		role: "Research",
		icon: "search",
		skillIds: ["web-research", "knowledge-wiki"],
		instructions: "You are Scout, the research specialist. Search knowledge and the web, cite sources, and write distilled wiki pages when you learn something durable."
	},
	{
		id: "writer",
		name: "Quill",
		title: "Content",
		role: "Writing",
		icon: "pen",
		skillIds: ["summarizer", "translator"],
		instructions: "You are Quill. Draft clear external content, briefs, and summaries. Keep tone calm and precise."
	},
	{
		id: "support",
		name: "Harbor",
		title: "Support",
		role: "Helpdesk",
		icon: "life-buoy",
		skillIds: ["summarizer", "memory-dream"],
		instructions: "You are Harbor. Answer product questions about CowAgent using memory and knowledge. Be patient and concrete."
	},
	{
		id: "analyst",
		name: "Lattice",
		title: "Data Analyst",
		role: "Analysis",
		icon: "chart",
		skillIds: ["summarizer", "planner"],
		instructions: "You are Lattice. Analyze structure, tradeoffs, and metrics. Prefer tables and numbered findings."
	},
	{
		id: "dev",
		name: "Forge",
		title: "Developer",
		role: "Engineering",
		icon: "code",
		skillIds: ["code-sandbox", "planner"],
		instructions: "You are Forge. Own code and technical work. Write files into the workspace, keep snippets runnable, explain briefly."
	}
];
var SKILLS = [
	{
		id: "web-research",
		name: "Web Research",
		category: "Research",
		source: "builtin",
		installed: true,
		summary: "Search the open web (Wikipedia index) and fold findings into answers.",
		instructions: "Use search_web for current or external facts. Quote titles. Distill lasting notes into knowledge."
	},
	{
		id: "memory-dream",
		name: "Deep Dream",
		category: "Memory",
		source: "builtin",
		installed: true,
		summary: "Distill conversations into core memory and a dream diary.",
		instructions: "When asked to remember or dream, write_memory on MEMORY.md and a daily/dream file."
	},
	{
		id: "knowledge-wiki",
		name: "Knowledge Wiki",
		category: "Knowledge",
		source: "builtin",
		installed: true,
		summary: "Create and update Markdown wiki pages and keep tags consistent.",
		instructions: "Use write_knowledge for durable concepts, entities, and sources."
	},
	{
		id: "planner",
		name: "Task Planner",
		category: "Planning",
		source: "hub",
		installed: true,
		summary: "Decompose goals into steps and optional scheduled follow-ups.",
		instructions: "Outline a short plan before tool use. Use schedule_task for recurring work."
	},
	{
		id: "code-sandbox",
		name: "Workspace Files",
		category: "Tools",
		source: "builtin",
		installed: true,
		summary: "Read and write a virtual project workspace.",
		instructions: "Use list_workspace, read_file, write_file for code and notes in the sandbox."
	},
	{
		id: "summarizer",
		name: "Summarizer",
		category: "Writing",
		source: "hub",
		installed: true,
		summary: "Compress long material into executive briefs.",
		instructions: "Lead with the answer. Use bullets. Keep under one screen unless asked."
	},
	{
		id: "translator",
		name: "Translator",
		category: "Writing",
		source: "hub",
		installed: false,
		summary: "Translate while preserving technical terms.",
		instructions: "Preserve code identifiers. Note untranslatable terms."
	},
	{
		id: "daily-brief",
		name: "Daily Brief",
		category: "Ops",
		source: "hub",
		installed: false,
		summary: "Morning digest of memory, tasks, and unfinished threads.",
		instructions: "Scan memory and tasks. Output a dated brief."
	},
	{
		id: "browser",
		name: "Browser Use",
		category: "Tools",
		source: "hub",
		installed: false,
		summary: "Navigate pages and extract structured content.",
		instructions: "Treat search_web as the available browsing surface in this console."
	},
	{
		id: "scheduler",
		name: "Scheduler",
		category: "Ops",
		source: "builtin",
		installed: true,
		summary: "Create reminders and recurring agent jobs.",
		instructions: "Use schedule_task. Confirm cadence in the reply."
	}
];
var MEMORY = [
	{
		id: "mem-core",
		filename: "MEMORY.md",
		kind: "global",
		updatedAt: T.now,
		content: `# Core memory

## Identity
- Console: CowAgent web demo, Agent Harness style.
- Default agent: Cow (Team Lead). Specialists: Scout, Quill, Harbor, Lattice, Forge.
- Model in this environment: xAI grok-4.5 (live). Other catalog models are listed but not connected.

## Working agreements
- Plan before long tool loops. Cap work to the user's ask.
- Persist durable facts with write_memory / write_knowledge.
- Prefer tables when comparing frameworks or models.

## User
- Exploring CowAgent capabilities: planning, memory, knowledge graph, skills, multi-agent.
- Likes concise, structured answers.
`
	},
	{
		id: "mem-d1",
		filename: "2026-09-18.md",
		kind: "daily",
		updatedAt: T.now,
		content: `# 2026-09-18

- Opened the CowAgent console demo.
- Interested in how ReAct, function calling, MCP, and tool-use relate.
`
	},
	{
		id: "mem-d2",
		filename: "2026-09-17.md",
		kind: "daily",
		updatedAt: T.d1,
		content: `# 2026-09-17

- Reviewed three-tier memory: context → daily → core.
- Deep Dream flagged as the distillation pass.
`
	},
	{
		id: "mem-d3",
		filename: "2026-09-16.md",
		kind: "daily",
		updatedAt: T.d2,
		content: `# 2026-09-16

- Installed Web Research, Knowledge Wiki, Task Planner.
- Connected the Web channel only.
`
	},
	{
		id: "mem-dream",
		filename: "DREAM.md",
		kind: "dream",
		updatedAt: T.d3,
		content: `# Dream diary

Last distillation folded tool-use vocabulary into core memory and tagged knowledge pages (ReAct, MCP, RAG). Unfinished: write a personal skill for weekly research.
`
	}
];
var KNOWLEDGE = [
	{
		id: "k-cow",
		title: "CowAgent",
		kind: "entity",
		tags: ["product", "harness"],
		updatedAt: T.now,
		content: `# CowAgent

Open-source super AI assistant and Agent Harness (formerly chatgpt-on-wechat). Messages arrive through channels; the agent core plans, uses tools and skills, reads memory and knowledge, then replies on the same channel.

Layers: Channels → Agent Core (plan, tools, skills, memory, knowledge) → Models.
`
	},
	{
		id: "k-arch",
		title: "Agent Architecture",
		kind: "concept",
		tags: ["harness", "planning"],
		updatedAt: T.now,
		content: `# Agent Architecture

Loop: receive → understand intent → plan → invoke tools → update memory/knowledge → return result. Bounded by max steps and context turns. Multi-agent teams share a conversation with isolated workspaces.
`
	},
	{
		id: "k-react",
		title: "ReAct",
		kind: "concept",
		tags: ["planning", "tools"],
		updatedAt: T.now,
		content: `# ReAct

Reasoning + Acting. The model interleaves Thought → Action → Observation until the goal is met. A reasoning framework / paradigm, not a wire protocol. Design goal: let the model think while doing.
`
	},
	{
		id: "k-fc",
		title: "Function Calling",
		kind: "concept",
		tags: ["tools", "api"],
		updatedAt: T.now,
		content: `# Function Calling

Model-native tool invocation. The developer declares JSON schemas; the model emits structured function calls; the runtime executes them and returns tool results. Solves structured output, not cross-runtime portability.
`
	},
	{
		id: "k-mcp",
		title: "MCP",
		kind: "concept",
		tags: ["tools", "protocol"],
		updatedAt: T.now,
		content: `# MCP (Model Context Protocol)

A standardized protocol for exposing tools, resources, and prompts from servers to agents. Analogous to a USB-C for tools: one client talks to many servers without a custom adapter each time.
`
	},
	{
		id: "k-tooluse",
		title: "Tool Use",
		kind: "concept",
		tags: ["tools", "planning"],
		updatedAt: T.now,
		content: `# Tool Use

The broad goal of letting language models act on the world: files, browsers, APIs, schedulers. ReAct, function calling, and MCP are implementations under this umbrella.
`
	},
	{
		id: "k-rag",
		title: "RAG",
		kind: "concept",
		tags: ["knowledge", "memory"],
		updatedAt: T.now,
		content: `# RAG (Retrieval-Augmented Generation)

Retrieve relevant documents, then generate. CowAgent combines keyword + vector retrieval over memory files and the Markdown wiki. Complements parametric model knowledge.
`
	},
	{
		id: "k-mem",
		title: "Long-term Memory",
		kind: "concept",
		tags: ["memory", "harness"],
		updatedAt: T.now,
		content: `# Long-term Memory

Three tiers: session context, daily notes (\`YYYY-MM-DD.md\`), core \`MEMORY.md\`. Deep Dream distills daily → core. Hybrid search (keyword + semantic) restores facts across sessions.
`
	},
	{
		id: "k-skills",
		title: "Agent Skill System",
		kind: "concept",
		tags: ["skills", "harness"],
		updatedAt: T.now,
		content: `# Agent Skill System

Installable playbooks (hub, GitHub, or authored in chat). A skill packages instructions plus the tools it expects. Enabling a skill changes how the agent plans without changing the model.
`
	},
	{
		id: "k-xai",
		title: "xAI",
		kind: "entity",
		tags: ["models", "api"],
		updatedAt: T.now,
		content: `# xAI

Model provider behind Grok. This console's live chat path uses grok-4.5 with OpenAI-compatible function calling.
`
	},
	{
		id: "k-openai",
		title: "OpenAI",
		kind: "entity",
		tags: ["models", "api"],
		updatedAt: T.d1,
		content: `# OpenAI

Origin of the function-calling schema most harnesses speak. Listed in the model catalog; not live in this demo.
`
	},
	{
		id: "k-anthropic",
		title: "Anthropic",
		kind: "entity",
		tags: ["models"],
		updatedAt: T.d1,
		content: `# Anthropic

Claude family. Strong at long-context tool use. Catalog only in this demo.
`
	},
	{
		id: "k-langchain",
		title: "LangChain",
		kind: "source",
		tags: ["tools", "framework"],
		updatedAt: T.d2,
		content: `# LangChain

Popular orchestration library for chains, agents, and retrievers. Overlaps CowAgent's harness layer with a different packaging.
`
	},
	{
		id: "k-karpathy",
		title: "Karpathy LLM Wiki",
		kind: "source",
		tags: ["knowledge", "rag"],
		updatedAt: T.d2,
		content: `# Karpathy LLM Wiki

Pattern of maintaining a living Markdown wiki as the system's ground truth — close to CowAgent's knowledge directory.
`
	},
	{
		id: "k-cot",
		title: "Chain of Thought",
		kind: "concept",
		tags: ["planning"],
		updatedAt: T.d3,
		content: `# Chain of Thought

Prompting the model to reason in steps. ReAct adds actions to that chain. Shown in the console as Thought traces.
`
	}
];
var WORKSPACE = [{
	path: "notes/readme.md",
	updatedAt: T.now,
	content: "# Workspace\n\nVirtual project files the agent can read and write.\n"
}];
var CHANNELS = [
	{
		id: "web",
		name: "Web Console",
		status: "connected",
		summary: "Default channel. Chat, config, and traces live here."
	},
	{
		id: "telegram",
		name: "Telegram",
		status: "available",
		summary: "Connect a bot token in the full CowAgent install."
	},
	{
		id: "slack",
		name: "Slack",
		status: "available",
		summary: "Workspace bot with threads and files."
	},
	{
		id: "discord",
		name: "Discord",
		status: "available",
		summary: "Guild bot, slash commands, attachments."
	},
	{
		id: "wechat",
		name: "WeChat",
		status: "available",
		summary: "Personal WeChat via the classic chatgpt-on-wechat path."
	},
	{
		id: "feishu",
		name: "Feishu / Lark",
		status: "available",
		summary: "App bot for Feishu groups and docs."
	},
	{
		id: "dingtalk",
		name: "DingTalk",
		status: "available",
		summary: "Enterprise group robot."
	},
	{
		id: "wecom",
		name: "WeCom",
		status: "offline",
		summary: "Not configured."
	}
];
var MODELS = [
	{
		id: "grok-4.5",
		provider: "xAI",
		name: "grok-4.5",
		live: true,
		modalities: [
			"Chat",
			"Tools",
			"Vision"
		]
	},
	{
		id: "claude-opus",
		provider: "Anthropic",
		name: "claude-opus",
		live: false,
		modalities: ["Chat", "Vision"]
	},
	{
		id: "gpt-4.1",
		provider: "OpenAI",
		name: "gpt-4.1",
		live: false,
		modalities: [
			"Chat",
			"Vision",
			"Image"
		]
	},
	{
		id: "gemini-flash",
		provider: "Google",
		name: "gemini-flash",
		live: false,
		modalities: ["Chat", "Vision"]
	},
	{
		id: "deepseek-v3",
		provider: "DeepSeek",
		name: "deepseek-v3",
		live: false,
		modalities: ["Chat"]
	},
	{
		id: "qwen-plus",
		provider: "Alibaba",
		name: "qwen-plus",
		live: false,
		modalities: ["Chat", "Vision"]
	}
];
var TASKS = [{
	id: "t-dream",
	title: "Nightly Deep Dream",
	cadence: "Daily 02:00",
	nextRun: "2026-09-19T02:00:00.000Z",
	enabled: true,
	notes: "Distill daily notes into MEMORY.md"
}, {
	id: "t-brief",
	title: "Morning brief",
	cadence: "Weekdays 08:30",
	nextRun: "2026-09-19T08:30:00.000Z",
	enabled: false,
	notes: "Requires Daily Brief skill"
}];
var LOGS = [
	{
		id: "l1",
		at: T.now,
		level: "info",
		source: "web",
		message: "Web console channel ready."
	},
	{
		id: "l2",
		at: T.d1,
		level: "info",
		source: "memory",
		message: "Loaded 5 memory files."
	},
	{
		id: "l3",
		at: T.d1,
		level: "tool",
		source: "knowledge",
		message: "Indexed 15 wiki pages for retrieval."
	}
];
function demoSession() {
	return {
		id: "ses-demo",
		title: "Agent core concepts",
		agentId: "lead",
		updatedAt: T.now,
		messages: [{
			id: "m1",
			role: "user",
			createdAt: T.now,
			content: "Compare ReAct, Function Calling, MCP, and Tool Use across design goal, invocation method, and ecosystem. Use the knowledge base and output a table."
		}, {
			id: "m2",
			role: "assistant",
			createdAt: T.now,
			traces: [
				{
					id: "t0",
					kind: "thought",
					name: "Thought",
					status: "ok",
					detail: "Pulling the four concept pages, then a compact table."
				},
				{
					id: "t1",
					kind: "tool",
					name: "search_knowledge",
					status: "ok",
					durationMs: 42,
					detail: "ReAct Function Calling MCP Tool Use"
				},
				{
					id: "t2",
					kind: "tool",
					name: "search_knowledge",
					status: "ok",
					durationMs: 31,
					detail: "agent architecture"
				}
			],
			content: `Great question — these four terms nest rather than compete.

**Hierarchy**

Tool Use (broad goal)
└─ ReAct (reasoning loop)
   └─ Function Calling (model-native JSON calls)
      └─ MCP (shared tool protocol)

## Comparison

| Dimension | ReAct | Function Calling | MCP | Tool Use |
| --- | --- | --- | --- | --- |
| Design goal | Think while doing: Thought → Action → Observation | Structured, schema-checked calls from the model | One protocol for many tool servers | Let the model act outside its weights |
| Invocation | Prompted loop; tools optional | Native \`tool_calls\` in the API | Client/server handshake, then tools | Umbrella: any of the above |
| Ecosystem | Papers + agent tutorials | Every major chat API | Fast-growing server catalog | Product term for the whole harness |

CowAgent's core is **tool use** implemented with **function calling**, optionally exposed through **MCP**, and steered with a **ReAct-style** plan/observe loop. Ask if you want this saved as a wiki page.`
		}]
	};
}
function emptySession(agentId) {
	return {
		id: crypto.randomUUID(),
		title: "New Chat",
		agentId,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		messages: []
	};
}
var demo = demoSession();
var useCowStore = create()(persist((set, get) => ({
	hydrated: false,
	sessions: [demo],
	activeSessionId: demo.id,
	agents: AGENTS,
	activeAgentId: "lead",
	skills: SKILLS,
	memoryFiles: MEMORY,
	knowledgePages: KNOWLEDGE,
	workspaceFiles: WORKSPACE,
	channels: CHANNELS,
	selectedModelId: "grok-4.5",
	tasks: TASKS,
	logs: LOGS,
	navOpen: false,
	historyOpen: true,
	setHydrated: () => set({ hydrated: true }),
	setNavOpen: (navOpen) => set({ navOpen }),
	setHistoryOpen: (historyOpen) => set({ historyOpen }),
	setActiveSession: (id) => set({ activeSessionId: id }),
	setActiveAgent: (id) => set({ activeAgentId: id }),
	setModel: (id) => set({ selectedModelId: id }),
	newSession: () => {
		const ses = emptySession(get().activeAgentId);
		set({
			sessions: [ses, ...get().sessions],
			activeSessionId: ses.id
		});
	},
	deleteSession: (id) => {
		const rest = get().sessions.filter((s) => s.id !== id);
		const next = rest.length ? rest : [emptySession(get().activeAgentId)];
		set({
			sessions: next,
			activeSessionId: get().activeSessionId === id ? next[0].id : get().activeSessionId
		});
	},
	renameSession: (id, title) => set({ sessions: get().sessions.map((s) => s.id === id ? {
		...s,
		title
	} : s) }),
	addMessage: (sessionId, msg) => set({ sessions: get().sessions.map((s) => s.id === sessionId ? {
		...s,
		updatedAt: msg.createdAt,
		messages: [...s.messages, msg]
	} : s) }),
	patchMessage: (sessionId, messageId, patch) => set({ sessions: get().sessions.map((s) => s.id === sessionId ? {
		...s,
		updatedAt: patch.createdAt ?? s.updatedAt,
		messages: s.messages.map((m) => m.id === messageId ? {
			...m,
			...patch
		} : m)
	} : s) }),
	applyPatches: (patches) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		set((st) => {
			let memoryFiles = st.memoryFiles;
			let knowledgePages = st.knowledgePages;
			let workspaceFiles = st.workspaceFiles;
			let tasks = st.tasks;
			if (patches.memory) {
				memoryFiles = [...memoryFiles];
				for (const f of patches.memory) {
					const i = memoryFiles.findIndex((x) => x.filename === f.filename);
					const next = {
						...f,
						updatedAt: f.updatedAt || now
					};
					if (i >= 0) memoryFiles[i] = next;
					else memoryFiles.unshift(next);
				}
			}
			if (patches.knowledge) {
				knowledgePages = [...knowledgePages];
				for (const p of patches.knowledge) {
					const i = knowledgePages.findIndex((x) => x.title === p.title);
					const next = {
						...p,
						updatedAt: p.updatedAt || now
					};
					if (i >= 0) knowledgePages[i] = next;
					else knowledgePages.unshift(next);
				}
			}
			if (patches.workspace) {
				workspaceFiles = [...workspaceFiles];
				for (const f of patches.workspace) {
					const i = workspaceFiles.findIndex((x) => x.path === f.path);
					const next = {
						...f,
						updatedAt: f.updatedAt || now
					};
					if (i >= 0) workspaceFiles[i] = next;
					else workspaceFiles.unshift(next);
				}
			}
			if (patches.tasks) {
				tasks = [...tasks];
				for (const t of patches.tasks) {
					const i = tasks.findIndex((x) => x.id === t.id || x.title === t.title);
					if (i >= 0) tasks[i] = t;
					else tasks.unshift(t);
				}
			}
			return {
				memoryFiles,
				knowledgePages,
				workspaceFiles,
				tasks
			};
		});
	},
	toggleSkill: (id) => set({ skills: get().skills.map((s) => s.id === id ? {
		...s,
		installed: !s.installed
	} : s) }),
	upsertAgent: (agent) => {
		const agents = [...get().agents];
		const i = agents.findIndex((a) => a.id === agent.id);
		if (i >= 0) agents[i] = agent;
		else agents.push(agent);
		set({ agents });
	},
	toggleTask: (id) => set({ tasks: get().tasks.map((t) => t.id === id ? {
		...t,
		enabled: !t.enabled
	} : t) }),
	addTask: (task) => set({ tasks: [task, ...get().tasks] }),
	addLog: (entry) => set({ logs: [{
		id: uid(),
		at: entry.at ?? (/* @__PURE__ */ new Date()).toISOString(),
		level: entry.level,
		source: entry.source,
		message: entry.message
	}, ...get().logs].slice(0, 80) }),
	upsertMemory: (file) => {
		const memoryFiles = [...get().memoryFiles];
		const i = memoryFiles.findIndex((x) => x.id === file.id || x.filename === file.filename);
		if (i >= 0) memoryFiles[i] = file;
		else memoryFiles.unshift(file);
		set({ memoryFiles });
	},
	upsertKnowledge: (page) => {
		const knowledgePages = [...get().knowledgePages];
		const i = knowledgePages.findIndex((x) => x.id === page.id || x.title === page.title);
		if (i >= 0) knowledgePages[i] = page;
		else knowledgePages.unshift(page);
		set({ knowledgePages });
	},
	connectChannel: (id) => set({ channels: get().channels.map((c) => c.id === id ? {
		...c,
		status: c.status === "connected" ? "available" : "connected"
	} : c) })
}), {
	name: "cowagent-console-v1",
	skipHydration: true,
	partialize: (s) => ({
		sessions: s.sessions,
		activeSessionId: s.activeSessionId,
		agents: s.agents,
		activeAgentId: s.activeAgentId,
		skills: s.skills,
		memoryFiles: s.memoryFiles,
		knowledgePages: s.knowledgePages,
		workspaceFiles: s.workspaceFiles,
		channels: s.channels,
		selectedModelId: s.selectedModelId,
		tasks: s.tasks,
		logs: s.logs
	})
}));
var MODELS_STATIC = MODELS;
function sessionTitleFrom(text) {
	const t = text.replace(/\s+/g, " ").trim();
	return t.length > 42 ? `${t.slice(0, 42)}…` : t || "New Chat";
}
function NavBody({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 py-3",
		children: NAV.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-subtle uppercase",
			children: group.section
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-0.5",
			children: group.items.map((item) => {
				const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					onClick: onNavigate,
					className: cn("flex h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-4", active ? "text-primary" : "text-subtle") }), item.label]
				}) }, item.to);
			})
		})] }, group.section))
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2.5 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CowMark, { className: "size-8 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex flex-col leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium tracking-tight",
				children: "CowAgent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-subtle",
				children: "Console"
			})]
		})]
	});
}
function AppShell({ children, crumb }) {
	const navOpen = useCowStore((s) => s.navOpen);
	const setNavOpen = useCowStore((s) => s.setNavOpen);
	const newSession = useCowStore((s) => s.newSession);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const unsub = useCowStore.persist.onFinishHydration(() => {
			useCowStore.getState().setHydrated();
		});
		useCowStore.persist.rehydrate();
		return unsub;
	}, []);
	const title = crumb ?? NAV.flatMap((g) => g.items).find((i) => i.to === "/" ? pathname === "/" : pathname.startsWith(i.to))?.label ?? "Chat";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-52 shrink-0 flex-col border-r border-border bg-sidebar md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-t border-border px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-subtle",
							children: "CowAgent demo"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				open: navOpen,
				onOpenChange: setNavOpen,
				title: "Navigation",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, { onNavigate: () => setNavOpen(false) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 md:px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								className: "md:hidden",
								"aria-label": "Open menu",
								onClick: () => setNavOpen(true),
								children: navOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "min-w-0 truncate text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "CowAgent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden text-subtle sm:inline",
										children: " / "
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: title
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-auto flex items-center gap-1",
								children: pathname === "/" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => newSession(),
									className: "hidden sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New Chat"]
								}) : null
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-hidden pb-14 md:pb-0",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-border bg-sidebar/95 md:hidden",
						children: MOBILE_TABS.map((tab) => {
							const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
							const Icon = tab.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								className: cn("flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px]", active ? "text-primary" : "text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), tab.label]
							}, tab.to);
						})
					})
				]
			})
		]
	});
}
var styles_default = "/assets/styles-DDPQXyE2.css";
var APP_NAME = "CowAgent";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0c0e"
			},
			{
				name: "description",
				content: "CowAgent console — plan tasks, run skills, and grow memory and knowledge."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-DG23FG23.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./agents-C-DfJVgM.mjs");
var Route$7 = createFileRoute("/agents")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./channels-D7zt4fWm.mjs");
var Route$6 = createFileRoute("/channels")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./knowledge-WempR_Rg.mjs");
var Route$5 = createFileRoute("/knowledge")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./logs-DndXyean.mjs");
var Route$4 = createFileRoute("/logs")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./memory-DljIhfh1.mjs");
var Route$3 = createFileRoute("/memory")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./models-oExiprCh.mjs");
var Route$2 = createFileRoute("/models")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./skills-DXYWy5nW.mjs");
var Route$1 = createFileRoute("/skills")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tasks-B72XyP6N.mjs");
var Route = createFileRoute("/tasks")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AgentsRoute: Route$7.update({
		id: "/agents",
		path: "/agents",
		getParentRoute: () => Route$9
	}),
	ChannelsRoute: Route$6.update({
		id: "/channels",
		path: "/channels",
		getParentRoute: () => Route$9
	}),
	KnowledgeRoute: Route$5.update({
		id: "/knowledge",
		path: "/knowledge",
		getParentRoute: () => Route$9
	}),
	LogsRoute: Route$4.update({
		id: "/logs",
		path: "/logs",
		getParentRoute: () => Route$9
	}),
	MemoryRoute: Route$3.update({
		id: "/memory",
		path: "/memory",
		getParentRoute: () => Route$9
	}),
	ModelsRoute: Route$2.update({
		id: "/models",
		path: "/models",
		getParentRoute: () => Route$9
	}),
	SkillsRoute: Route$1.update({
		id: "/skills",
		path: "/skills",
		getParentRoute: () => Route$9
	}),
	TasksRoute: Route.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Button as a, useCowStore as i, MODELS_STATIC as n, CowMark as o, sessionTitleFrom as r, router_exports as t };

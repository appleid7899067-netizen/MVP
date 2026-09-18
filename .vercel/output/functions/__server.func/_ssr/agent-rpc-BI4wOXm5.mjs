import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { c as uid } from "./utils-dvwzML2A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-rpc-BI4wOXm5.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var TOOLS = [
	{
		type: "function",
		function: {
			name: "search_memory",
			description: "Keyword search over long-term and daily memory files.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "write_memory",
			description: "Create or replace a memory file (MEMORY.md, YYYY-MM-DD.md, or DREAM.md).",
			parameters: {
				type: "object",
				properties: {
					filename: { type: "string" },
					content: { type: "string" },
					kind: {
						type: "string",
						enum: [
							"global",
							"daily",
							"dream"
						]
					}
				},
				required: ["filename", "content"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "search_knowledge",
			description: "Search the Markdown wiki by title, tags, or body.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "write_knowledge",
			description: "Create or update a wiki page.",
			parameters: {
				type: "object",
				properties: {
					title: { type: "string" },
					content: { type: "string" },
					kind: {
						type: "string",
						enum: [
							"concept",
							"source",
							"entity"
						]
					},
					tags: {
						type: "string",
						description: "Comma-separated tags"
					}
				},
				required: ["title", "content"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "search_web",
			description: "Search Wikipedia for an external fact or definition.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "list_workspace",
			description: "List virtual workspace file paths.",
			parameters: {
				type: "object",
				properties: {}
			}
		}
	},
	{
		type: "function",
		function: {
			name: "read_file",
			description: "Read a workspace file by path.",
			parameters: {
				type: "object",
				properties: { path: { type: "string" } },
				required: ["path"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "write_file",
			description: "Write a workspace file.",
			parameters: {
				type: "object",
				properties: {
					path: { type: "string" },
					content: { type: "string" }
				},
				required: ["path", "content"]
			}
		}
	},
	{
		type: "function",
		function: {
			name: "schedule_task",
			description: "Schedule a recurring or one-off agent task.",
			parameters: {
				type: "object",
				properties: {
					title: { type: "string" },
					cadence: { type: "string" },
					notes: { type: "string" }
				},
				required: ["title", "cadence"]
			}
		}
	}
];
function clip(s, n) {
	return s.length > n ? `${s.slice(0, n)}…` : s;
}
function scoreMatch(hay, query) {
	const q = query.toLowerCase().split(/\s+/).filter(Boolean);
	const h = hay.toLowerCase();
	let n = 0;
	for (const w of q) if (h.includes(w)) n += 1;
	return n;
}
async function wikiSearch(query) {
	const url = new URL("https://en.wikipedia.org/w/api.php");
	url.searchParams.set("action", "query");
	url.searchParams.set("list", "search");
	url.searchParams.set("srsearch", query);
	url.searchParams.set("srlimit", "3");
	url.searchParams.set("format", "json");
	const res = await fetch(url, {
		headers: { "User-Agent": "CowAgentDemo/1.0 (console demo)" },
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) return `Wikipedia search failed (${res.status}).`;
	const hits = (await res.json()).query?.search ?? [];
	if (!hits.length) return "No Wikipedia hits.";
	return hits.map((h) => `### ${h.title}\n${h.snippet.replace(/<[^>]+>/g, "")}`).join("\n\n");
}
function runTool(name, rawArgs, ctx) {
	let args = {};
	try {
		args = JSON.parse(rawArgs || "{}");
	} catch {
		return "Invalid JSON arguments.";
	}
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (name === "search_memory") {
		const q = args.query ?? "";
		const ranked = ctx.memory.map((f) => ({
			f,
			s: scoreMatch(`${f.filename}\n${f.content}`, q)
		})).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4);
		if (!ranked.length) return "No memory hits.";
		return ranked.map((x) => `## ${x.f.filename}\n${clip(x.f.content, 900)}`).join("\n\n");
	}
	if (name === "write_memory") {
		const filename = args.filename || "MEMORY.md";
		const kind = args.kind || (filename === "MEMORY.md" ? "global" : filename === "DREAM.md" ? "dream" : "daily");
		const file = {
			id: uid(),
			filename,
			kind,
			content: args.content ?? "",
			updatedAt: now
		};
		ctx.patches.memory = ctx.patches.memory.filter((x) => x.filename !== filename);
		ctx.patches.memory.push(file);
		const i = ctx.memory.findIndex((x) => x.filename === filename);
		if (i >= 0) ctx.memory[i] = file;
		else ctx.memory.unshift(file);
		return `Wrote ${filename} (${file.content.length} chars).`;
	}
	if (name === "search_knowledge") {
		const q = args.query ?? "";
		const ranked = ctx.knowledge.map((p) => ({
			p,
			s: scoreMatch(`${p.title} ${p.tags.join(" ")} ${p.content}`, q)
		})).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 5);
		if (!ranked.length) return "No wiki hits.";
		return ranked.map((x) => `## ${x.p.title}\n${clip(x.p.content, 700)}`).join("\n\n");
	}
	if (name === "write_knowledge") {
		const title = args.title || "Untitled";
		const page = {
			id: uid(),
			title,
			kind: args.kind || "concept",
			tags: (args.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
			content: args.content ?? "",
			updatedAt: now
		};
		ctx.patches.knowledge = ctx.patches.knowledge.filter((x) => x.title !== title);
		ctx.patches.knowledge.push(page);
		const i = ctx.knowledge.findIndex((x) => x.title === title);
		if (i >= 0) ctx.knowledge[i] = page;
		else ctx.knowledge.unshift(page);
		return `Wrote wiki page "${title}".`;
	}
	if (name === "search_web") return wikiSearch(args.query ?? "");
	if (name === "list_workspace") {
		if (!ctx.workspace.length) return "(empty workspace)";
		return ctx.workspace.map((f) => f.path).join("\n");
	}
	if (name === "read_file") {
		const f = ctx.workspace.find((x) => x.path === args.path);
		return f ? f.content : `Not found: ${args.path}`;
	}
	if (name === "write_file") {
		const file = {
			path: args.path || "notes/untitled.md",
			content: args.content ?? "",
			updatedAt: now
		};
		ctx.patches.workspace = ctx.patches.workspace.filter((x) => x.path !== file.path);
		ctx.patches.workspace.push(file);
		const i = ctx.workspace.findIndex((x) => x.path === file.path);
		if (i >= 0) ctx.workspace[i] = file;
		else ctx.workspace.unshift(file);
		return `Wrote ${file.path}.`;
	}
	if (name === "schedule_task") {
		const task = {
			id: uid(),
			title: args.title,
			cadence: args.cadence,
			notes: args.notes ?? "",
			enabled: true,
			nextRun: now
		};
		ctx.patches.tasks.push(task);
		return `Scheduled "${task.title}" (${task.cadence}).`;
	}
	return `Unknown tool ${name}`;
}
function systemPrompt(input) {
	const skillBlock = input.skills.length ? input.skills.map((s) => `- ${s.name}: ${s.instructions}`).join("\n") : "- (none installed)";
	const memIndex = input.memory.map((m) => m.filename).join(", ") || "(none)";
	const knowIndex = input.knowledge.map((k) => k.title).join(", ") || "(none)";
	if (input.mode === "dream") return `You are CowAgent Deep Dream. Distill the provided memory and recent conversation into:
1) An updated MEMORY.md (core facts only)
2) A DREAM.md diary entry for today
Use write_memory for both, then reply with a short summary of what you consolidated. Do not invent a personal biography.`;
	return `You are ${input.agent.name}, ${input.agent.title} in CowAgent — an open-source Agent Harness.
${input.agent.instructions}

Installed skills:
${skillBlock}

Memory files: ${memIndex}
Wiki pages: ${knowIndex}

Rules:
- For multi-step or factual asks, call tools (search_knowledge first, then search_memory, then search_web).
- Persist durable user facts with write_memory. Persist reusable concepts with write_knowledge.
- Reply in clean Markdown. Use tables for comparisons. No emoji.
- Keep tool loops short. After tools, give the final answer — do not narrate the tools.
- This console's live model is grok-4.5. Other catalog models are not connected.`;
}
async function chatOnce(apiKey, messages, withTools) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			temperature: .5,
			max_tokens: 1400,
			...withTools ? {
				tools: TOOLS,
				tool_choice: "auto"
			} : {}
		}),
		signal: AbortSignal.timeout(28e3)
	});
	if (!res.ok) {
		const t = await res.text().catch(() => "");
		throw new Error(`xAI API error ${res.status}${t ? `: ${clip(t, 180)}` : ""}`);
	}
	return (await res.json()).choices[0]?.message;
}
var runAgent_createServerFn_handler = createServerRpc({
	id: "bf3fe5199edff6931d1bab9bc6e8d95b30174e6ba73866b9cdd8fe8c756e6906",
	name: "runAgent",
	filename: "src/lib/cow/agent-rpc.ts"
}, (opts) => runAgent.__executeServer(opts));
var runAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(runAgent_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const memory = data.memory.map((m) => ({ ...m }));
	const knowledge = data.knowledge.map((k) => ({ ...k }));
	const workspace = data.workspace.map((w) => ({ ...w }));
	const patches = {
		memory: [],
		knowledge: [],
		workspace: [],
		tasks: []
	};
	const traces = [];
	const history = data.messages.slice(-10).map((m) => ({
		role: m.role,
		content: m.content
	}));
	const messages = [{
		role: "system",
		content: systemPrompt(data)
	}, ...history];
	try {
		for (let round = 0; round < 5; round++) {
			const msg = await chatOnce(apiKey, messages, true);
			if (!msg) return {
				ok: false,
				error: "Empty model response."
			};
			const calls = msg.tool_calls ?? [];
			if (msg.content?.trim() && (calls.length || round === 0)) traces.push({
				id: uid(),
				kind: "thought",
				name: "Thought",
				status: "ok",
				detail: clip(msg.content.trim(), 280)
			});
			if (!calls.length) return {
				ok: true,
				content: (msg.content ?? "").trim() || "Done.",
				traces,
				patches
			};
			messages.push({
				role: "assistant",
				content: msg.content ?? "",
				tool_calls: calls
			});
			for (const call of calls) {
				const started = Date.now();
				const traceId = uid();
				let output = "";
				let status = "ok";
				try {
					output = await runTool(call.function.name, call.function.arguments, {
						memory,
						knowledge,
						workspace,
						patches
					});
				} catch (err) {
					status = "error";
					output = err instanceof Error ? err.message : "Tool failed";
				}
				traces.push({
					id: traceId,
					kind: "tool",
					name: call.function.name,
					status,
					durationMs: Date.now() - started,
					detail: clip(call.function.arguments.replace(/\s+/g, " "), 160),
					output: clip(output, 1200)
				});
				messages.push({
					role: "tool",
					tool_call_id: call.id,
					content: clip(output, 4e3)
				});
			}
		}
		return {
			ok: true,
			content: ((await chatOnce(apiKey, messages, false))?.content ?? "Reached the tool-step limit.").trim(),
			traces,
			patches
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Agent run failed."
		};
	}
});
//#endregion
export { runAgent_createServerFn_handler };

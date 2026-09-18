import type {
  AgentProfile,
  Channel,
  KnowledgePage,
  LogEntry,
  MemoryFile,
  ModelOption,
  ScheduledTask,
  Session,
  Skill,
  WorkspaceFile,
} from "./types";

const T = {
  now: "2026-09-18T03:12:00.000Z",
  d1: "2026-09-17T18:40:00.000Z",
  d2: "2026-09-16T09:15:00.000Z",
  d3: "2026-09-11T11:08:00.000Z",
};

export const AGENTS: AgentProfile[] = [
  {
    id: "lead",
    name: "Cow",
    title: "Team Lead",
    role: "Orchestrator",
    icon: "shield",
    isDefault: true,
    skillIds: ["web-research", "memory-dream", "knowledge-wiki", "planner"],
    instructions:
      "You are Cow, the default CowAgent. Receive tasks, break them down, call tools, coordinate specialist skills, and return one consolidated reply. Prefer structured markdown (tables, headings) when comparing ideas.",
  },
  {
    id: "research",
    name: "Scout",
    title: "Researcher",
    role: "Research",
    icon: "search",
    skillIds: ["web-research", "knowledge-wiki"],
    instructions:
      "You are Scout, the research specialist. Search knowledge and the web, cite sources, and write distilled wiki pages when you learn something durable.",
  },
  {
    id: "writer",
    name: "Quill",
    title: "Content",
    role: "Writing",
    icon: "pen",
    skillIds: ["summarizer", "translator"],
    instructions:
      "You are Quill. Draft clear external content, briefs, and summaries. Keep tone calm and precise.",
  },
  {
    id: "support",
    name: "Harbor",
    title: "Support",
    role: "Helpdesk",
    icon: "life-buoy",
    skillIds: ["summarizer", "memory-dream"],
    instructions:
      "You are Harbor. Answer product questions about CowAgent using memory and knowledge. Be patient and concrete.",
  },
  {
    id: "analyst",
    name: "Lattice",
    title: "Data Analyst",
    role: "Analysis",
    icon: "chart",
    skillIds: ["summarizer", "planner"],
    instructions:
      "You are Lattice. Analyze structure, tradeoffs, and metrics. Prefer tables and numbered findings.",
  },
  {
    id: "dev",
    name: "Forge",
    title: "Developer",
    role: "Engineering",
    icon: "code",
    skillIds: ["code-sandbox", "planner"],
    instructions:
      "You are Forge. Own code and technical work. Write files into the workspace, keep snippets runnable, explain briefly.",
  },
];

export const SKILLS: Skill[] = [
  {
    id: "web-research",
    name: "Web Research",
    category: "Research",
    source: "builtin",
    installed: true,
    summary: "Search the open web (Wikipedia index) and fold findings into answers.",
    instructions: "Use search_web for current or external facts. Quote titles. Distill lasting notes into knowledge.",
  },
  {
    id: "memory-dream",
    name: "Deep Dream",
    category: "Memory",
    source: "builtin",
    installed: true,
    summary: "Distill conversations into core memory and a dream diary.",
    instructions: "When asked to remember or dream, write_memory on MEMORY.md and a daily/dream file.",
  },
  {
    id: "knowledge-wiki",
    name: "Knowledge Wiki",
    category: "Knowledge",
    source: "builtin",
    installed: true,
    summary: "Create and update Markdown wiki pages and keep tags consistent.",
    instructions: "Use write_knowledge for durable concepts, entities, and sources.",
  },
  {
    id: "planner",
    name: "Task Planner",
    category: "Planning",
    source: "hub",
    installed: true,
    summary: "Decompose goals into steps and optional scheduled follow-ups.",
    instructions: "Outline a short plan before tool use. Use schedule_task for recurring work.",
  },
  {
    id: "code-sandbox",
    name: "Workspace Files",
    category: "Tools",
    source: "builtin",
    installed: true,
    summary: "Read and write a virtual project workspace.",
    instructions: "Use list_workspace, read_file, write_file for code and notes in the sandbox.",
  },
  {
    id: "summarizer",
    name: "Summarizer",
    category: "Writing",
    source: "hub",
    installed: true,
    summary: "Compress long material into executive briefs.",
    instructions: "Lead with the answer. Use bullets. Keep under one screen unless asked.",
  },
  {
    id: "translator",
    name: "Translator",
    category: "Writing",
    source: "hub",
    installed: false,
    summary: "Translate while preserving technical terms.",
    instructions: "Preserve code identifiers. Note untranslatable terms.",
  },
  {
    id: "daily-brief",
    name: "Daily Brief",
    category: "Ops",
    source: "hub",
    installed: false,
    summary: "Morning digest of memory, tasks, and unfinished threads.",
    instructions: "Scan memory and tasks. Output a dated brief.",
  },
  {
    id: "browser",
    name: "Browser Use",
    category: "Tools",
    source: "hub",
    installed: false,
    summary: "Navigate pages and extract structured content.",
    instructions: "Treat search_web as the available browsing surface in this console.",
  },
  {
    id: "scheduler",
    name: "Scheduler",
    category: "Ops",
    source: "builtin",
    installed: true,
    summary: "Create reminders and recurring agent jobs.",
    instructions: "Use schedule_task. Confirm cadence in the reply.",
  },
];

export const MEMORY: MemoryFile[] = [
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
`,
  },
  {
    id: "mem-d1",
    filename: "2026-09-18.md",
    kind: "daily",
    updatedAt: T.now,
    content: `# 2026-09-18

- Opened the CowAgent console demo.
- Interested in how ReAct, function calling, MCP, and tool-use relate.
`,
  },
  {
    id: "mem-d2",
    filename: "2026-09-17.md",
    kind: "daily",
    updatedAt: T.d1,
    content: `# 2026-09-17

- Reviewed three-tier memory: context → daily → core.
- Deep Dream flagged as the distillation pass.
`,
  },
  {
    id: "mem-d3",
    filename: "2026-09-16.md",
    kind: "daily",
    updatedAt: T.d2,
    content: `# 2026-09-16

- Installed Web Research, Knowledge Wiki, Task Planner.
- Connected the Web channel only.
`,
  },
  {
    id: "mem-dream",
    filename: "DREAM.md",
    kind: "dream",
    updatedAt: T.d3,
    content: `# Dream diary

Last distillation folded tool-use vocabulary into core memory and tagged knowledge pages (ReAct, MCP, RAG). Unfinished: write a personal skill for weekly research.
`,
  },
];

export const KNOWLEDGE: KnowledgePage[] = [
  {
    id: "k-cow",
    title: "CowAgent",
    kind: "entity",
    tags: ["product", "harness"],
    updatedAt: T.now,
    content: `# CowAgent

Open-source super AI assistant and Agent Harness (formerly chatgpt-on-wechat). Messages arrive through channels; the agent core plans, uses tools and skills, reads memory and knowledge, then replies on the same channel.

Layers: Channels → Agent Core (plan, tools, skills, memory, knowledge) → Models.
`,
  },
  {
    id: "k-arch",
    title: "Agent Architecture",
    kind: "concept",
    tags: ["harness", "planning"],
    updatedAt: T.now,
    content: `# Agent Architecture

Loop: receive → understand intent → plan → invoke tools → update memory/knowledge → return result. Bounded by max steps and context turns. Multi-agent teams share a conversation with isolated workspaces.
`,
  },
  {
    id: "k-react",
    title: "ReAct",
    kind: "concept",
    tags: ["planning", "tools"],
    updatedAt: T.now,
    content: `# ReAct

Reasoning + Acting. The model interleaves Thought → Action → Observation until the goal is met. A reasoning framework / paradigm, not a wire protocol. Design goal: let the model think while doing.
`,
  },
  {
    id: "k-fc",
    title: "Function Calling",
    kind: "concept",
    tags: ["tools", "api"],
    updatedAt: T.now,
    content: `# Function Calling

Model-native tool invocation. The developer declares JSON schemas; the model emits structured function calls; the runtime executes them and returns tool results. Solves structured output, not cross-runtime portability.
`,
  },
  {
    id: "k-mcp",
    title: "MCP",
    kind: "concept",
    tags: ["tools", "protocol"],
    updatedAt: T.now,
    content: `# MCP (Model Context Protocol)

A standardized protocol for exposing tools, resources, and prompts from servers to agents. Analogous to a USB-C for tools: one client talks to many servers without a custom adapter each time.
`,
  },
  {
    id: "k-tooluse",
    title: "Tool Use",
    kind: "concept",
    tags: ["tools", "planning"],
    updatedAt: T.now,
    content: `# Tool Use

The broad goal of letting language models act on the world: files, browsers, APIs, schedulers. ReAct, function calling, and MCP are implementations under this umbrella.
`,
  },
  {
    id: "k-rag",
    title: "RAG",
    kind: "concept",
    tags: ["knowledge", "memory"],
    updatedAt: T.now,
    content: `# RAG (Retrieval-Augmented Generation)

Retrieve relevant documents, then generate. CowAgent combines keyword + vector retrieval over memory files and the Markdown wiki. Complements parametric model knowledge.
`,
  },
  {
    id: "k-mem",
    title: "Long-term Memory",
    kind: "concept",
    tags: ["memory", "harness"],
    updatedAt: T.now,
    content: `# Long-term Memory

Three tiers: session context, daily notes (\`YYYY-MM-DD.md\`), core \`MEMORY.md\`. Deep Dream distills daily → core. Hybrid search (keyword + semantic) restores facts across sessions.
`,
  },
  {
    id: "k-skills",
    title: "Agent Skill System",
    kind: "concept",
    tags: ["skills", "harness"],
    updatedAt: T.now,
    content: `# Agent Skill System

Installable playbooks (hub, GitHub, or authored in chat). A skill packages instructions plus the tools it expects. Enabling a skill changes how the agent plans without changing the model.
`,
  },
  {
    id: "k-xai",
    title: "xAI",
    kind: "entity",
    tags: ["models", "api"],
    updatedAt: T.now,
    content: `# xAI

Model provider behind Grok. This console's live chat path uses grok-4.5 with OpenAI-compatible function calling.
`,
  },
  {
    id: "k-openai",
    title: "OpenAI",
    kind: "entity",
    tags: ["models", "api"],
    updatedAt: T.d1,
    content: `# OpenAI

Origin of the function-calling schema most harnesses speak. Listed in the model catalog; not live in this demo.
`,
  },
  {
    id: "k-anthropic",
    title: "Anthropic",
    kind: "entity",
    tags: ["models"],
    updatedAt: T.d1,
    content: `# Anthropic

Claude family. Strong at long-context tool use. Catalog only in this demo.
`,
  },
  {
    id: "k-langchain",
    title: "LangChain",
    kind: "source",
    tags: ["tools", "framework"],
    updatedAt: T.d2,
    content: `# LangChain

Popular orchestration library for chains, agents, and retrievers. Overlaps CowAgent's harness layer with a different packaging.
`,
  },
  {
    id: "k-karpathy",
    title: "Karpathy LLM Wiki",
    kind: "source",
    tags: ["knowledge", "rag"],
    updatedAt: T.d2,
    content: `# Karpathy LLM Wiki

Pattern of maintaining a living Markdown wiki as the system's ground truth — close to CowAgent's knowledge directory.
`,
  },
  {
    id: "k-cot",
    title: "Chain of Thought",
    kind: "concept",
    tags: ["planning"],
    updatedAt: T.d3,
    content: `# Chain of Thought

Prompting the model to reason in steps. ReAct adds actions to that chain. Shown in the console as Thought traces.
`,
  },
];

export const WORKSPACE: WorkspaceFile[] = [
  {
    path: "notes/readme.md",
    updatedAt: T.now,
    content: "# Workspace\n\nVirtual project files the agent can read and write.\n",
  },
];

export const CHANNELS: Channel[] = [
  { id: "web", name: "Web Console", status: "connected", summary: "Default channel. Chat, config, and traces live here." },
  { id: "telegram", name: "Telegram", status: "available", summary: "Connect a bot token in the full CowAgent install." },
  { id: "slack", name: "Slack", status: "available", summary: "Workspace bot with threads and files." },
  { id: "discord", name: "Discord", status: "available", summary: "Guild bot, slash commands, attachments." },
  { id: "wechat", name: "WeChat", status: "available", summary: "Personal WeChat via the classic chatgpt-on-wechat path." },
  { id: "feishu", name: "Feishu / Lark", status: "available", summary: "App bot for Feishu groups and docs." },
  { id: "dingtalk", name: "DingTalk", status: "available", summary: "Enterprise group robot." },
  { id: "wecom", name: "WeCom", status: "offline", summary: "Not configured." },
];

export const MODELS: ModelOption[] = [
  { id: "puter-default", provider: "Puter", name: "Puter default", live: true, modalities: ["Chat"] },
  { id: "claude-opus", provider: "Anthropic", name: "claude-opus", live: false, modalities: ["Chat", "Vision"] },
  { id: "gpt-4.1", provider: "OpenAI", name: "gpt-4.1", live: false, modalities: ["Chat", "Vision", "Image"] },
  { id: "gemini-flash", provider: "Google", name: "gemini-flash", live: false, modalities: ["Chat", "Vision"] },
  { id: "deepseek-v3", provider: "DeepSeek", name: "deepseek-v3", live: false, modalities: ["Chat"] },
  { id: "qwen-plus", provider: "Alibaba", name: "qwen-plus", live: false, modalities: ["Chat", "Vision"] },
];

export const TASKS: ScheduledTask[] = [
  {
    id: "t-dream",
    title: "Nightly Deep Dream",
    cadence: "Daily 02:00",
    nextRun: "2026-09-19T02:00:00.000Z",
    enabled: true,
    notes: "Distill daily notes into MEMORY.md",
  },
  {
    id: "t-brief",
    title: "Morning brief",
    cadence: "Weekdays 08:30",
    nextRun: "2026-09-19T08:30:00.000Z",
    enabled: false,
    notes: "Requires Daily Brief skill",
  },
];

export const LOGS: LogEntry[] = [
  { id: "l1", at: T.now, level: "info", source: "web", message: "Web console channel ready." },
  { id: "l2", at: T.d1, level: "info", source: "memory", message: "Loaded 5 memory files." },
  { id: "l3", at: T.d1, level: "tool", source: "knowledge", message: "Indexed 15 wiki pages for retrieval." },
];

export function demoSession(): Session {
  return {
    id: "ses-demo",
    title: "Agent core concepts",
    agentId: "lead",
    updatedAt: T.now,
    messages: [
      {
        id: "m1",
        role: "user",
        createdAt: T.now,
        content:
          "Compare ReAct, Function Calling, MCP, and Tool Use across design goal, invocation method, and ecosystem. Use the knowledge base and output a table.",
      },
      {
        id: "m2",
        role: "assistant",
        createdAt: T.now,
        traces: [
          { id: "t0", kind: "thought", name: "Thought", status: "ok", detail: "Pulling the four concept pages, then a compact table." },
          { id: "t1", kind: "tool", name: "search_knowledge", status: "ok", durationMs: 42, detail: "ReAct Function Calling MCP Tool Use" },
          { id: "t2", kind: "tool", name: "search_knowledge", status: "ok", durationMs: 31, detail: "agent architecture" },
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

CowAgent's core is **tool use** implemented with **function calling**, optionally exposed through **MCP**, and steered with a **ReAct-style** plan/observe loop. Ask if you want this saved as a wiki page.`,
      },
    ],
  };
}

export function emptySession(agentId: string): Session {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    agentId,
    updatedAt: new Date().toISOString(),
    messages: [],
  };
}

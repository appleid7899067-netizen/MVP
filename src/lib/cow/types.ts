export type Role = "user" | "assistant";

export type TraceKind = "thought" | "tool";

export type TraceStatus = "running" | "ok" | "error";

export interface ToolTrace {
  id: string;
  kind: TraceKind;
  name: string;
  status: TraceStatus;
  durationMs?: number;
  detail?: string;
  output?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  traces?: ToolTrace[];
  pending?: boolean;
}

export interface Session {
  id: string;
  title: string;
  agentId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AgentProfile {
  id: string;
  name: string;
  title: string;
  role: string;
  instructions: string;
  icon: string;
  skillIds: string[];
  isDefault?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  summary: string;
  instructions: string;
  source: "hub" | "builtin" | "custom";
  installed: boolean;
  category: string;
}

export type MemoryKind = "global" | "daily" | "dream";

export interface MemoryFile {
  id: string;
  filename: string;
  kind: MemoryKind;
  content: string;
  updatedAt: string;
}

export type KnowledgeKind = "concept" | "source" | "entity";

export interface KnowledgePage {
  id: string;
  title: string;
  kind: KnowledgeKind;
  tags: string[];
  content: string;
  updatedAt: string;
}

export interface WorkspaceFile {
  path: string;
  content: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  status: "connected" | "available" | "offline";
  summary: string;
}

export interface ModelOption {
  id: string;
  provider: string;
  name: string;
  live: boolean;
  modalities: string[];
}

export interface ScheduledTask {
  id: string;
  title: string;
  cadence: string;
  nextRun: string;
  enabled: boolean;
  notes: string;
}

export type LogLevel = "info" | "tool" | "error";

export interface LogEntry {
  id: string;
  at: string;
  level: LogLevel;
  source: string;
  message: string;
}

export interface CowPatches {
  memory?: MemoryFile[];
  knowledge?: KnowledgePage[];
  workspace?: WorkspaceFile[];
  tasks?: ScheduledTask[];
}

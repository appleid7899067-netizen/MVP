import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AGENTS,
  CHANNELS,
  KNOWLEDGE,
  LOGS,
  MEMORY,
  MODELS,
  SKILLS,
  TASKS,
  WORKSPACE,
  demoSession,
  emptySession,
} from "./seed";
import type {
  AgentProfile,
  Channel,
  ChatMessage,
  CowPatches,
  KnowledgePage,
  LogEntry,
  MemoryFile,
  ScheduledTask,
  Session,
  Skill,
  WorkspaceFile,
} from "./types";
import { uid } from "@/lib/utils";

interface CowState {
  hydrated: boolean;
  sessions: Session[];
  activeSessionId: string;
  agents: AgentProfile[];
  activeAgentId: string;
  skills: Skill[];
  memoryFiles: MemoryFile[];
  knowledgePages: KnowledgePage[];
  workspaceFiles: WorkspaceFile[];
  channels: Channel[];
  selectedModelId: string;
  tasks: ScheduledTask[];
  logs: LogEntry[];
  navOpen: boolean;
  historyOpen: boolean;

  setHydrated: () => void;
  setNavOpen: (v: boolean) => void;
  setHistoryOpen: (v: boolean) => void;
  setActiveSession: (id: string) => void;
  setActiveAgent: (id: string) => void;
  setModel: (id: string) => void;
  newSession: () => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  addMessage: (sessionId: string, msg: ChatMessage) => void;
  patchMessage: (sessionId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  applyPatches: (patches: CowPatches) => void;
  toggleSkill: (id: string) => void;
  upsertAgent: (agent: AgentProfile) => void;
  toggleTask: (id: string) => void;
  addTask: (task: ScheduledTask) => void;
  addLog: (entry: Omit<LogEntry, "id" | "at"> & { at?: string }) => void;
  upsertMemory: (file: MemoryFile) => void;
  upsertKnowledge: (page: KnowledgePage) => void;
  connectChannel: (id: string) => void;
}

const demo = demoSession();

export const useCowStore = create<CowState>()(
  persist(
    (set, get) => ({
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
        set({ sessions: [ses, ...get().sessions], activeSessionId: ses.id });
      },

      deleteSession: (id) => {
        const rest = get().sessions.filter((s) => s.id !== id);
        const next = rest.length ? rest : [emptySession(get().activeAgentId)];
        set({
          sessions: next,
          activeSessionId: get().activeSessionId === id ? next[0].id : get().activeSessionId,
        });
      },

      renameSession: (id, title) =>
        set({
          sessions: get().sessions.map((s) => (s.id === id ? { ...s, title } : s)),
        }),

      addMessage: (sessionId, msg) =>
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId
              ? { ...s, updatedAt: msg.createdAt, messages: [...s.messages, msg] }
              : s,
          ),
        }),

      patchMessage: (sessionId, messageId, patch) =>
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  updatedAt: patch.createdAt ?? s.updatedAt,
                  messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
                }
              : s,
          ),
        }),

      applyPatches: (patches) => {
        const now = new Date().toISOString();
        set((st) => {
          let memoryFiles = st.memoryFiles;
          let knowledgePages = st.knowledgePages;
          let workspaceFiles = st.workspaceFiles;
          let tasks = st.tasks;
          if (patches.memory) {
            memoryFiles = [...memoryFiles];
            for (const f of patches.memory) {
              const i = memoryFiles.findIndex((x) => x.filename === f.filename);
              const next = { ...f, updatedAt: f.updatedAt || now };
              if (i >= 0) memoryFiles[i] = next;
              else memoryFiles.unshift(next);
            }
          }
          if (patches.knowledge) {
            knowledgePages = [...knowledgePages];
            for (const p of patches.knowledge) {
              const i = knowledgePages.findIndex((x) => x.title === p.title);
              const next = { ...p, updatedAt: p.updatedAt || now };
              if (i >= 0) knowledgePages[i] = next;
              else knowledgePages.unshift(next);
            }
          }
          if (patches.workspace) {
            workspaceFiles = [...workspaceFiles];
            for (const f of patches.workspace) {
              const i = workspaceFiles.findIndex((x) => x.path === f.path);
              const next = { ...f, updatedAt: f.updatedAt || now };
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
          return { memoryFiles, knowledgePages, workspaceFiles, tasks };
        });
      },

      toggleSkill: (id) =>
        set({
          skills: get().skills.map((s) => (s.id === id ? { ...s, installed: !s.installed } : s)),
        }),

      upsertAgent: (agent) => {
        const agents = [...get().agents];
        const i = agents.findIndex((a) => a.id === agent.id);
        if (i >= 0) agents[i] = agent;
        else agents.push(agent);
        set({ agents });
      },

      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
        }),

      addTask: (task) => set({ tasks: [task, ...get().tasks] }),

      addLog: (entry) =>
        set({
          logs: [
            {
              id: uid(),
              at: entry.at ?? new Date().toISOString(),
              level: entry.level,
              source: entry.source,
              message: entry.message,
            },
            ...get().logs,
          ].slice(0, 80),
        }),

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

      connectChannel: (id) =>
        set({
          channels: get().channels.map((c) =>
            c.id === id ? { ...c, status: c.status === "connected" ? "available" : "connected" } : c,
          ),
        }),
    }),
    {
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
        logs: s.logs,
      }),
    },
  ),
);

export const MODELS_STATIC = MODELS;

export function sessionTitleFrom(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 42 ? `${t.slice(0, 42)}…` : t || "New Chat";
}

import {
  BookOpen,
  Brain,
  Clock,
  Cpu,
  MessageSquare,
  Radio,
  Terminal,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon };
export type NavGroup = { section: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    section: "Chat",
    items: [{ to: "/", label: "Chat", icon: MessageSquare }],
  },
  {
    section: "Management",
    items: [
      { to: "/agents", label: "Agents", icon: Users },
      { to: "/models", label: "Models", icon: Cpu },
      { to: "/skills", label: "Skills", icon: Zap },
      { to: "/memory", label: "Memory", icon: Brain },
      { to: "/knowledge", label: "Knowledge", icon: BookOpen },
      { to: "/channels", label: "Channels", icon: Radio },
      { to: "/tasks", label: "Tasks", icon: Clock },
    ],
  },
  {
    section: "Monitor",
    items: [{ to: "/logs", label: "Logs", icon: Terminal }],
  },
];

export const MOBILE_TABS: NavItem[] = [
  { to: "/", label: "Chat", icon: MessageSquare },
  { to: "/agents", label: "Agents", icon: Users },
  { to: "/skills", label: "Skills", icon: Zap },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
];

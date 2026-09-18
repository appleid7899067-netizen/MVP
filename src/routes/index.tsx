import { createFileRoute } from "@tanstack/react-router";
import { ChatView } from "@/components/chat/chat-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ChatView />;
}

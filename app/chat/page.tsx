import { Chat } from "@/components/chat/chat";
import { PageHeader } from "@/components/page-header";

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="AI Chat" description="" />
      <Chat />
    </div>
  );
}

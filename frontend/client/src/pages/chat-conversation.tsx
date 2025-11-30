import { useRoute } from "wouter";
import Header from "@/components/header";
import ChatWindow from "@/components/chat/chat-window";

export default function ChatConversationPage() {
  const [, params] = useRoute("/chat/:id");
  const conversationId = params?.id || "";
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <ChatWindow conversationId={conversationId} />
      </div>
    </div>
  );
}

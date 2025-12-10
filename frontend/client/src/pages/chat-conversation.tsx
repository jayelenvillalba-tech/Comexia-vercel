import { useRoute } from "wouter";
import Header from "@/components/header";
import ChatWindow from "@/components/chat/chat-window";
import ChatSidebar from "@/components/chat/chat-sidebar";

export default function ChatConversationPage() {
  const [, params] = useRoute("/chat/:id");
  const conversationId = params?.id || "";
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1929]">
      <Header />
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-73px)]">
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow conversationId={conversationId} />
        </div>
        <div className="hidden lg:block h-full">
          <ChatSidebar conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}

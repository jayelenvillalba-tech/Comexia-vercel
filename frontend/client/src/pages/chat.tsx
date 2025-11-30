import Header from "@/components/header";
import ChatList from "@/components/chat/chat-list";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <ChatList />
      </div>
    </div>
  );
}

import { CouncilChat } from "@/components/councils/council-chat";
import { CouncilChatHeroCard } from "@/components/councils/council-chat-hero-card";

export default function CouncilChatPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <CouncilChatHeroCard />
      <CouncilChat className="mt-4" />
    </div>
  );
}

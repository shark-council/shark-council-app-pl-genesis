import { CouncilNewHeroCard } from "@/components/councils/council-new-hero-card";
import { CouncilNewForm } from "../../../components/councils/council-new-form";

export default function CouncilNewPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <CouncilNewHeroCard />
      <CouncilNewForm className="mt-4" />
    </div>
  );
}

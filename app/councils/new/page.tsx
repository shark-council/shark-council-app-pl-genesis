import { CouncilNewHeroCard } from "@/components/councils/council-new-hero-card";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: Add a form to create a new council
export default function CouncilNewPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <CouncilNewHeroCard />
      <Skeleton className="h-8 mt-4" />
    </div>
  );
}

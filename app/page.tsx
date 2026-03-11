import { IndexActivitySection } from "@/components/index/sections/index-activity-section";
import { IndexAgentsSection } from "@/components/index/sections/index-agents-section";
import { IndexHeroSection } from "@/components/index/sections/index-hero-section";
import { IndexTechnologiesSection } from "@/components/index/sections/index-technologies-section";
import { Separator } from "@/components/ui/separator";

export default function IndexPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <IndexHeroSection />
      <Separator className="mt-12" />
      <IndexTechnologiesSection className="mt-12" />
      <Separator className="mt-12" />
      <IndexActivitySection className="mt-12" />
      <Separator className="mt-12" />
      <IndexAgentsSection className="mt-12" />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { BotIcon, MessagesSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function IndexHeroSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      {/* Image */}
      <Image
        src="/images/hero.png"
        alt="Hero"
        priority={false}
        width="100"
        height="100"
        sizes="100vw"
        className="w-full rounded-md"
      />
      {/* Title, subtitle */}
      <h2 className="text-3xl font-bold tracking-tight text-center mt-6">
        Consult the Shark Council before you risk your crypto
      </h2>
      <h4 className="text-xl text-muted-foreground tracking-tight text-center mt-2">
        Stress-test your crypto trade ideas through live debates between AI
        agents for actionable risk verdicts and instant DEX execution
      </h4>
      {/* Buttons */}
      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        <Button variant="default" size="lg" asChild>
          <Link href="/councils/new">
            <MessagesSquareIcon /> Consult the Council
          </Link>
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <Link href="/agents/new">
            <BotIcon /> List a Shark
          </Link>
        </Button>
      </div>
    </div>
  );
}

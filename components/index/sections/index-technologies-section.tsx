import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

// TODO: Add more technologies
export function IndexTechnologiesSection(props: { className?: ClassValue }) {
  return (
    <div className={cn(props.className)}>
      <p className="font-bold text-center">Technologies</p>
      <p className="text-muted-foreground text-center">
        The engine behind the experience
      </p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/flow.png" />
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Flow</ItemTitle>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/storacha.png" />
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Storacha</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}

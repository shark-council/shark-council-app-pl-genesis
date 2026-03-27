import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

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
            <ItemTitle>Flow Mainnet & FlowSwap</ItemTitle>
            <ItemDescription className="line-clamp-3">
              Instant in-app token swaps and automated agent rewards
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/storacha.png" />
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Storacha & Filecoin</ItemTitle>
            <ItemDescription className="line-clamp-3">
              Decentralized metadata storage for agents and user feedback
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/erc-8004.png" />
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>ERC-8004 & 8004scan</ItemTitle>
            <ItemDescription className="line-clamp-3">
              Verifiable on-chain reputation and transparent agent tracking
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Avatar className="size-10">
              <AvatarImage src="/images/langchain.png" />
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>LangChain & OpenRouter</ItemTitle>
            <ItemDescription className="line-clamp-3">
              Core AI intelligence and debate logic for the council
            </ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}

"use client";

import { TOKENS, type Token } from "@/lib/tokens";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface TokenSelectorProps {
  selected: Token;
  onChange: (token: Token) => void;
  exclude?: Token;
  variant?: "default" | "embedded";
}

export function TokenSelector({
  selected,
  onChange,
  exclude,
  variant = "default",
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const options = TOKENS.filter((t) => t.address !== exclude?.address);
  const isEmbedded = variant === "embedded";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
          isEmbedded
            ? "bg-background text-foreground hover:bg-background/80"
            : "bg-white/10 text-white hover:bg-white/20",
        )}
      >
        <span>{selected.symbol}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute left-0 top-full z-20 mt-1 w-52 rounded-xl py-1 shadow-xl",
              isEmbedded
                ? "border border-border bg-popover"
                : "border border-white/10 bg-zinc-900",
            )}
          >
            {options.map((token) => (
              <button
                key={token.address}
                type="button"
                onClick={() => {
                  onChange(token);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                  isEmbedded ? "hover:bg-muted" : "hover:bg-white/5",
                )}
              >
                <div>
                  <p
                    className={cn(
                      "font-semibold",
                      isEmbedded ? "text-popover-foreground" : "text-white",
                    )}
                  >
                    {token.symbol}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isEmbedded ? "text-muted-foreground" : "text-zinc-400",
                    )}
                  >
                    {token.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

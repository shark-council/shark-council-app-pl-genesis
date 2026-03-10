"use client";

import { TOKENS, type Token } from "@/lib/tokens";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface TokenSelectorProps {
  selected: Token;
  onChange: (token: Token) => void;
  exclude?: Token;
}

export function TokenSelector({
  selected,
  onChange,
  exclude,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const options = TOKENS.filter((t) => t.address !== exclude?.address);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
      >
        <span>{selected.symbol}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-xl border border-white/10 bg-zinc-900 py-1 shadow-xl">
            {options.map((token) => (
              <button
                key={token.address}
                type="button"
                onClick={() => {
                  onChange(token);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="font-semibold text-white">{token.symbol}</p>
                  <p className="text-xs text-zinc-400">{token.name}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

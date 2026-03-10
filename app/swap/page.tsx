import { SwapCard } from "@/components/swap/SwapCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const metadata = {
  title: "Swap | Shark Council",
  description: "Swap tokens on Flow EVM via flowswap.io (Uniswap V3)",
};

export default function SwapPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Swap</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Powered by{" "}
              <a
                href="https://flowswap.io/swap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                flowswap.io
              </a>{" "}
              (Uniswap V3 on Flow EVM)
            </p>
          </div>
          <ConnectButton />
        </div>

        <SwapCard />
      </div>
    </main>
  );
}

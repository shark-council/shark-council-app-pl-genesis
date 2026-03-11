"use client";

import { appConfig } from "@/config/app";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { flowMainnet } from "viem/chains";
import { WagmiProvider as BaseWagmiProvider } from "wagmi";

const config = getDefaultConfig({
  appName: appConfig.name,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  chains: [flowMainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseWagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </BaseWagmiProvider>
  );
}

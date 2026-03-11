"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as BaseWagmiProvider } from "wagmi";
import { flowEvm } from "@/lib/chains";
import { appConfig } from "@/config/app";

const config = getDefaultConfig({
  appName: appConfig.name,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  chains: [flowEvm],
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

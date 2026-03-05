import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { mainnet, solana } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import React from "react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

const metadata = {
  name: "Cryptocurrency Checkout | Charlie Unicorn AI",
  description:
    "Cryptocurrency payment mini-checkout based on Charlie Unicorn AI ecosystem",
  url: "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const evmNetworks = [mainnet];
const solanaNetworks = [solana];

const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
  ssr: true,
  syncConnectedChain: false,
});

const solanaAdapter = new SolanaAdapter();

createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks: [...evmNetworks, ...solanaNetworks] as any,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
  },
});

interface AppkitProviderProps {
  children: React.ReactNode;
}

const AppKitProvider: React.FC<AppkitProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default AppKitProvider;

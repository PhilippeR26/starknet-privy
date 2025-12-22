"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const loginMethods = ['email'] as Array<("email" | "wallet" | "sms" | "google" | "twitter" | "discord" | "github" | "linkedin" | "spotify" | "instagram" | "tiktok" | "line" | "twitch" | "apple" | "farcaster" | "telegram" | "passkey")>;

export default function PrivyProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID?? 'demo-app-id'}
      config={{
        loginMethods,
        appearance: {
          theme: 'light',
          accentColor: '#0C0C4F',
          logo: undefined,
        },
        // embeddedWallets: {
        //   ethereum: {
        //     createOnLogin: "users-without-wallets",
        //   },
        // },
        // supportedChains: [
        //   {
        //     id: 1,
        //     name: 'Ethereum',
        //     network: 'homestead',
        //     nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        //     rpcUrls: {
        //       default: { http: ['https://rpc.ankr.com/eth'] },
        //       public: { http: ['https://rpc.ankr.com/eth'] },
        //     },
        //   },
        //   {
        //     id: 11155111,
        //     name: 'Ethereum Sepolia',
        //     network: 'sepolia',
        //     nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        //     rpcUrls: {
        //       default: { http: ['https://rpc.sepolia.org'] },
        //       public: { http: ['https://rpc.sepolia.org'] },
        //     },
        //   }
        // ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
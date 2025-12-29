"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const loginMethods = ['email'] as Array<("email" | "wallet" | "sms" | "google" | "twitter" | "discord" | "github" | "linkedin" | "spotify" | "instagram" | "tiktok" | "line" | "twitch" | "apple" | "farcaster" | "telegram" | "passkey")>;

export default function PrivyProviders({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID?? ""}
      config={{
        loginMethods,
        appearance: {
          theme: 'light',
          accentColor: '#0C0C4F',
          logo: undefined,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
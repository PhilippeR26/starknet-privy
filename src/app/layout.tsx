
import React from 'react';
import './globals.css';
import { Provider as ChakraProvider } from "@/components/ui/provider";
import type { Metadata } from 'next';
import PrivyProviders from './components/client/provider/PrivyProviders';


export const metadata: Metadata = {
  title: 'Starknet-Privy',
  description: 'Demo of Starknet.js Privy signature',
  icons: {
    icon: "./favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <PrivyProviders>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </PrivyProviders>
      </body>
    </html>
  )
}

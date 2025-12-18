"use server";

import type { LinkedAccountWithMetadata, PrivyClient, User, WalletApiWalletResponseType, WalletWithMetadata } from "@privy-io/server-auth";
import { getPrivyClientServerAuth } from "./privyClient";
import type { WalletDef } from "../types";

/**
 * Get Data from the Starknet account.
 * As the type `LinkedAccountCurveSigningEmbeddedWallet` is not exported from the new node lib, it's necessary to use the deprecated server-auth library.
 * @param userId 
 * @returns 
 */
export async function getWallets(userId: string): Promise<WalletDef[]> {
    const privy: PrivyClient = getPrivyClientServerAuth();
    const user: User = await privy.getUserById(userId);
    const accounts = user?.linkedAccounts;
    const starkWallets = (accounts.filter(
        (acc: LinkedAccountWithMetadata) => acc.type === "wallet" && acc.chainType === "starknet"
    )) as WalletWithMetadata[];
    const wallets = await Promise.all(
        starkWallets.map(async (acc: WalletWithMetadata) => {
            try {
                const w: WalletApiWalletResponseType = await privy.walletApi.getWallet({ id: acc.id! });
                const publicKey: string | undefined = w.publicKey;
                const address: string = w.address;
                return {
                    id: w.id,
                    address,
                    chainType: w.chainType,
                    publicKey,
                } as WalletDef;

            } catch {
                return {
                    id: acc.id!,
                    address: acc.address!,
                    chainType: acc.chainType ?? "starknet",
                } as WalletDef;
            }
        })
    );
    return wallets;
}
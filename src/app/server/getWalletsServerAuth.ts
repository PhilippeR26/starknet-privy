"use server";

import type { LinkedAccountWithMetadata, PrivyClient, User, WalletApiWalletResponseType, WalletWithMetadata } from "@privy-io/server-auth";
import { getPrivyClientServer } from "./privyClient";
import type { WalletDef } from "../types";

/**
 * Get Data from the Starknet account.
 * As the type `LinkedAccountCurveSigningEmbeddedWallet` is not exported from the new node lib, it's necessary to use the deprecated server-auth library.
 * @param userId 
 * @returns 
 */
export async function getWalletsServer(userId: string): Promise<WalletDef | undefined> {
    const privy: PrivyClient = getPrivyClientServer();
    const user: User = await privy.getUserById(userId);
    const accounts = user?.linkedAccounts;
    const starkWallets = (accounts.filter(
        (acc: LinkedAccountWithMetadata) => acc.type === "wallet" && acc.chainType === "starknet"
    )) as WalletWithMetadata[];
    console.log("getWalletNode: starkWallets.length=", starkWallets.length);
    if (starkWallets.length === 0) return undefined;
    const snWallet = starkWallets[0];
    const w: WalletApiWalletResponseType = await privy.walletApi.getWallet({ id: snWallet.id! });
    const publicKey: string | undefined = w.publicKey;
    const def = {
        id: w.id,
        address: w.address,
        chainType: w.chainType,
        publicKey: publicKey,
    } as WalletDef
    return def;
}
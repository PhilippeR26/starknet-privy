"use server";

import { getPrivyClientNode } from "./privyClient";
import type { WalletDef } from "../types";
import type { PrivyClient as PrivyClientNode, User } from "@privy-io/node";

/**
 * Get Data from the Starknet account.
 * Do not work, because `LinkedAccountCurveSigningEmbeddedWallet` is not exported by node lib!!!!
 * @param userId 
 * @returns 
 */
export async function getWalletsNode(userId: string): Promise<WalletDef|undefined> {
    const privy: PrivyClientNode = getPrivyClientNode();
    const user: User = await privy.users()._get(userId);
    const accounts = user.linked_accounts;
    const starkWallets = (accounts.filter(
        (acc) => acc.type === "wallet" && acc.chain_type === "starknet"
    )) as any[];
    console.log("getWalletNode: starkWallets.length=",starkWallets.length);
    if (starkWallets.length===0) return undefined;
    const w = starkWallets[0];
    
    const def = {
        id: w.id,
        address: w.address,
        chainType: w.chain_type,
        publicKey: w.public_key,
    } as WalletDef
    return def;
}

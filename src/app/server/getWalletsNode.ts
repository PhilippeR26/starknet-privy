"use server";

import { getPrivyClientNode } from "./privyClient";
import type { WalletDef } from "../types";
import type { PrivyClient as PrivyClientNode, User } from "@privy-io/node";
import { getStarknetWallet } from "./getStarknetWallet";

/**
 * Get Data from the Starknet account.
 * Do not work, because `LinkedAccountCurveSigningEmbeddedWallet` is not exported by node lib!!!!
 * @param userId 
 * @returns 
 */
export async function getWalletsNode(userId: string): Promise<WalletDef|undefined> {
    const privy: PrivyClientNode = await getPrivyClientNode(userId);
    const w=await getStarknetWallet(privy,userId);
    const def = {
        id: w.id,
        address: w.address,
        chainType: w.chain_type,
        publicKey: w.public_key,
    } as WalletDef
    return def;
}

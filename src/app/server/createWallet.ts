"use server";

import { getPrivyClientNode } from "./privyClient";
import type { PrivyClient, Wallet , LinkedAccountEmbeddedWallet} from "@privy-io/node";

export async function createPrivyWallet(userId: string): Promise<Wallet> {
    const privyNode: PrivyClient = getPrivyClientNode();

    try {
        const result: Wallet = await privyNode.wallets().create(
            {
                chain_type: "starknet",
                owner_id: userId,
            }
        );
        console.log("Server createWallet =", result);
        return result;
    } catch (err: any) {
        throw new Error("Failed to create new Privy Wallet :" + err);
    }

}

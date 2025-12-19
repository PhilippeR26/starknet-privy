"use server";

import { userAgent } from "next/server";
import { getPrivyClientServer } from "./privyClient";
import type { PrivyClient, Wallet, WalletApiWalletResponseType } from "@privy-io/server-auth";

export async function createPrivyWallet(userId: string): Promise<WalletApiWalletResponseType> {
    const privyServer: PrivyClient = getPrivyClientServer();
    // console.log("createWallet: privyServer =",privyServer);
    // const user=await privyServer.getUserById(userId);
    // console.log("createWallet: user.id =",user.id);
    try {
        const result: WalletApiWalletResponseType = await privyServer.walletApi.createWallet(
            {
                chainType: "starknet",
                ...{ owner: { userId } }
            }
        );
        console.log("Server createWallet =", result);
        return result;
    } catch (err: any) {
        throw new Error("Failed to create new Privy Wallet :" + err);
    }

}

import type { PrivyClient as PrivyClientNode, User } from "@privy-io/node";

export async function getStarknetWallet(privy:PrivyClientNode, userId:string):Promise<any> {
    const user: User = await privy.users()._get(userId);
    const accounts = user.linked_accounts;
    const starkWallets = (accounts.filter(
        (acc) => acc.type === "wallet" && acc.chain_type === "starknet"
    )) as any[];
    console.log("getWalletNode: starkWallets.length=",starkWallets.length);
    if (starkWallets.length===0) return undefined;
    return starkWallets[0];
}
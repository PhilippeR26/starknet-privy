"use server";

import { Account, CallData, constants, Contract, type Call, type InvokeFunctionResponse, type RpcProvider } from "starknet";
import { addrSTRK, myFrontendProviders, ReadyAccountClassHash } from "../utils/constants";
import type { WalletDef } from "../types";
import { calculatePrivyAccountAddress, definePrivyConstructor } from "../utils/account";
import { ERC20Abi } from "@/contracts/erc20";



export async function createPrivyAccount(wallet: WalletDef): Promise<string> {
    const myProvider: RpcProvider = myFrontendProviders[2];
    const account0 = new Account({
        provider: myProvider,
        address: process.env.SPONSOR_ACCOUNT_ADDRESS ?? "MISSING",
        signer: process.env.SPONSOR_ACCOUNT_PRIVATE ?? "MISSING"
    });
    const newAddress = calculatePrivyAccountAddress(wallet);
    console.log({ newAddress });
    try {
        await myProvider.getClassAt(newAddress);
        console.warn("Account is already existing.");
        return newAddress;
    } catch { }

    const deployAccount: Call = {
        contractAddress: constants.UDC.ADDRESS,
        entrypoint: constants.UDC.ENTRYPOINT,
        calldata: CallData.compile({
            classHash: ReadyAccountClassHash,
            salt: wallet.publicKey ?? "0x00",
            unique: "0",
            calldata: definePrivyConstructor(wallet),
        }),
    };
    console.log("Deploy of account in progress...\n", deployAccount);
    console.log("fund new account...");
    const strkContract = new Contract({ abi: ERC20Abi.abi, address: addrSTRK, providerOrAccount: account0 });
    const transferCallSTRK: Call = strkContract.populate("transfer", {
        recipient: newAddress,
        amount: 15n * 10n ** 17n, // 1.5 STRK
    });
    console.log("transferCallSTRK =", transferCallSTRK);
    const { transaction_hash: txHDepl }: InvokeFunctionResponse = await account0.execute([deployAccount, transferCallSTRK]);
    console.log("account deployed with txH =", txHDepl);
    const txR = await account0.waitForTransaction(txHDepl);

    return newAddress;
}


"use server";

import type { TxResponse, WalletDef } from "../types";
import { Account, type Call, Contract, type InvokeFunctionResponse, type RpcProvider } from "starknet";
import { addrSTRK, myFrontendProviders, SignatureValidationL2Resources } from "../utils/constants";
import { PrivySigner } from "./privySign";
import { ERC20Abi } from "@/contracts/erc20";




// send 0.01 STRK to the sponsor account.
// 🚨 To use JWT, the privy team must have authorized manually the APP to use them.
export async function serverActionTransaction(walletDef: WalletDef, jwt: string): Promise<TxResponse> {
    const myProvider: RpcProvider = myFrontendProviders[2];
    const privySigner = new PrivySigner(walletDef, jwt);
    const account0 = new Account({
        provider: myProvider,
        address: walletDef.address,
        signer: privySigner
    });
    const strkContract = new Contract({ abi: ERC20Abi.abi, address: addrSTRK, providerOrAccount: account0 });
    const transferCallSTRK: Call = strkContract.populate("transfer", {
        recipient: process.env.SPONSOR_ACCOUNT_ADDRESS ?? "",
        amount: 1n * 10n ** 16n, // 0.01 STRK to the sponsor
    });
    console.log("transferCallSTRK =", transferCallSTRK);
    try {
        const estimateFees = await account0.estimateInvokeFee(transferCallSTRK, { skipValidate: true });
        // if L2 amount is not increased, we have during account validation an Error 55: "out of gas".
        const tmpL2amount = estimateFees.resourceBounds.l2_gas.max_amount;
        console.log("Estimate L2 amount=", tmpL2amount);
        estimateFees.resourceBounds.l2_gas.max_amount += SignatureValidationL2Resources;
        console.log("estimateFees2=", estimateFees.resourceBounds.l2_gas.max_amount, "total=", estimateFees.overall_fee, "digits=", estimateFees.overall_fee.toString().length - 1);
        const { transaction_hash: txHDepl }: InvokeFunctionResponse = await account0.execute(transferCallSTRK, {
            resourceBounds: estimateFees.resourceBounds,
            skipValidate: true,
        });
        console.log("0.01 STRK transfer with txH =", txHDepl);
        const txR = await account0.waitForTransaction(txHDepl);
        if (txR.isSuccess()) {
            return { isSuccess: true, err: txR.execution_status + " " + txR.revert_reason };
        }
        if (txR.isReverted()) {
            return { isSuccess: false, err: txR.execution_status + " " + txR.revert_reason };
        }
        return { isSuccess: false, err: "unknown error." };
    } catch (err: any) {
        console.error("transaction failed :", err);
        return { isSuccess: false, err: err as string }
    }
}


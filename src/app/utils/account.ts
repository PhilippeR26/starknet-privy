import { CairoCustomEnum, CairoOption, CairoOptionVariant, CallData, hash, type Calldata } from "starknet";
import type { WalletDef } from "../types";
import { ReadyAccountAbi } from "@/contracts/ReadyAbi";
import { ReadyAccountClassHash } from "./constants";


export function definePrivyConstructor(privyWallet:WalletDef): Calldata {
    const callDataReady = new CallData(ReadyAccountAbi.abi);
    const ReadyStarknet = new CairoCustomEnum({
        Starknet: {
            pubkey: privyWallet.publicKey??""
        }
    });
    console.log("constructor ReadyStarknet=", ReadyStarknet);
    const ReadyGuardian = new CairoOption(CairoOptionVariant.None);
    const constructorReadyCallData = callDataReady.compile("constructor", {
        owner: ReadyStarknet,
        guardian: ReadyGuardian
    });
    console.log("constructor =", constructorReadyCallData);
    return constructorReadyCallData;
}

export function calculatePrivyAccountAddress(privyWallet:WalletDef): string {
    const constructorReadyCallData = definePrivyConstructor(privyWallet);
    const salt = privyWallet.publicKey??"0x00";
    console.log("salt=", salt);
    console.log("constructor=", constructorReadyCallData);
    console.log("ReadyAccountClassHash=", ReadyAccountClassHash);
    const accountReadyAddress = hash.calculateContractAddressFromHash(salt, ReadyAccountClassHash, constructorReadyCallData, 0);
    console.log('Precalculated account address=', accountReadyAddress);
    return accountReadyAddress;
}
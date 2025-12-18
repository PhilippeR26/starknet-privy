"use client";
import type { Account } from "starknet";
import { create } from "zustand";
import type { WalletDef } from "./types";
interface GlobalState {
    walletDefinition: WalletDef | undefined,
    setWalletDefinition: (walletDefinition: WalletDef | undefined) => void;
    privyAccount: Account | undefined,
    setPrivyAccount: (webAuthNAccount: Account | undefined) => void,
}

export const useGlobalContext = create<GlobalState>()(set => ({
    walletDefinition: undefined,
    setWalletDefinition: (walletDefinition: WalletDef | undefined) => { set(state => ({ walletDefinition })) },
    privyAccount: undefined,
    setPrivyAccount: (privyAccount: Account | undefined) => { set(_state => ({ privyAccount })) },
}));

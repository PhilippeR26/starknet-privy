"use client";
import type { Account } from "starknet";
import { create } from "zustand";
import type { WalletDef } from "./types";
interface GlobalState {
    walletDefinition: WalletDef | undefined,
    setWalletDefinition: (walletDefinition: WalletDef | undefined) => void;
}

export const useGlobalContext = create<GlobalState>()(set => ({
    walletDefinition: undefined,
    setWalletDefinition: (walletDefinition: WalletDef | undefined) => { set(state => ({ walletDefinition })) },
}));

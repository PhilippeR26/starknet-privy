import type { BigNumberish, CairoCustomEnum, Uint256 } from "starknet";

// "argent::signer::signer_signature::SignerSignature"
export enum SignerType {
  Starknet,
  Secp256k1,
  Secp256r1,
  Eip191,
  Webauthn,
}

export type WalletDef = {
  id: string,
  address: string,
  chainType: string,
  publicKey?: string,
}

export type  GenerateAuthorizationSignatureInput= {
    version: 1;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    body: any;
    timestamp?: number;
    headers: {
        'privy-app-id': string;
        'privy-idempotency-key'?: string;
    };
}

export type GenerateAuthorizationSignatureOutput= {
    signature: string;
}
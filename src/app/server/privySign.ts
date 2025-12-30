
import { getPrivyClientNode } from "./privyClient";
import type { WalletDef } from "../types";
import { encode, Signer, type Signature } from "starknet";
import type { AuthorizationContext, PrivyClient as PrivyClientNode } from "@privy-io/node";


export class PrivySigner extends Signer {
    public privyWalletDef: WalletDef;
    public jwt: string;

    constructor(privyWalletDef: WalletDef, jwt: string) {
        console.log("privy signer constructor. privyWalletDef=", privyWalletDef);
        if (!privyWalletDef.publicKey) {
            throw new Error("No public key in privy signer constructor");
        }
        super(privyWalletDef.publicKey);
        this.privyWalletDef = privyWalletDef;
        this.jwt = jwt;
    }

    protected async signRaw(msgHash: string): Promise<Signature> {
        console.log("txHash calculated=", msgHash);
        const signature = await privySign(
            this.privyWalletDef,
            msgHash,
            this.jwt
        );
        console.log("Signer signature =", signature);
        return signature;
    }
}


export async function privySign(wallet: WalletDef, messageHash: string, jwt: string): Promise<Signature> {
    const privyNode: PrivyClientNode = getPrivyClientNode();
    const authPrivK = process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY ?? "";
    try {
        const verifiedClaims = await privyNode.utils().auth().verifyAuthToken(jwt);
        console.log("jwt verified:", verifiedClaims, "\nCreated:", new Date(verifiedClaims.issued_at * 1000), ", expired:", new Date(verifiedClaims.expiration * 1000));
    } catch (error: any) {
        throw new Error(`Token verification failed with error ${error.error}.`);
    }
    const authorizationContext: AuthorizationContext = { user_jwts: [jwt] };
    console.log({ authorizationContext });

    try {
        const responseSignature = await privyNode.wallets().rawSign(
            wallet.id,
            {
                params: { hash: messageHash },
                authorization_context: authorizationContext,
            },
        );
        console.log("response signature :", responseSignature.signature);
        const r = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(0, 64));
        const s = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(64));
        const decodedSignature = [r, s];
        console.log("decoded signature :", decodedSignature);
        return decodedSignature;
    } catch (error: any) {
        throw new Error(`raw sign failed with error ${error}.`);
    }
}

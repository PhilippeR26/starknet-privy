"use server";

import { getPrivyClientNode } from "./privyClient";
import type { WalletDef } from "../types";
import { encode, type Signature } from "starknet";
import type { AuthorizationContext, PrivyClient as PrivyClientNode } from "@privy-io/node";

export async function privySign(wallet: WalletDef, messageHash: string, jwt: string): Promise<Signature> {
    const privyNode: PrivyClientNode = getPrivyClientNode();
    const authPrivK = process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY ?? "";
    try {
        const verifiedClaims = await privyNode.utils().auth().verifyAuthToken(jwt);
        console.log("jwt verified:", verifiedClaims, "\nCreated:", new Date(verifiedClaims.issued_at * 1000), ", expired:", new Date(verifiedClaims.expiration * 1000));
    } catch (error: any) {
        throw new Error(`Token verification failed with error ${error.error}.`);
    }
    // const authorizationContext: AuthorizationContext = { authorization_private_keys: [authPrivK] };
    // ******* Do not work --> Error: 401 {"error":"No valid authorization keys or user signing keys available"}

    const authorizationContext: AuthorizationContext = { user_jwts: [jwt] };
    // ******* Do not work --> Error: 400 {"error":"Invalid JWT token provided","code":"invalid_data"}

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
        const r = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(0, 32));
        const s = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(32));
        const decodedSignature = [r, s];
        console.log("decoded signature :", decodedSignature);
        return decodedSignature;
    } catch (error: any) {
        throw new Error(`raw sign failed with error ${error}.`);
    }
    // const responseSignature = await buildAPIRequest(wallet, messageHash);

}

async function buildAPIRequest(wallet: WalletDef, messageHash: string): Promise<{ signature: string }> {
    const url = `https://api.privy.io/v1/wallets/${wallet.id}/raw_sign`;
    const body = { params: { hash: messageHash } };


    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
    const appSecret = process.env.PRIVY_APP_SECRET ?? "";
    console.log({ appId });
    console.log({ appSecret });

    const headers: Record<string, string> = {
        "privy-app-id": appId,
        "Content-Type": "application/json",
    };
    // App authentication for Wallet API
    headers["Authorization"] = `Basic ${Buffer.from(
        `${appId}:${appSecret}`
    ).toString("base64")}`;
    console.log("rawsign header =", headers);

    const respRawSign = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    console.log("respRawSign=", respRawSign);
    return { signature: "0x123412341234123412341234123412341234123412341234" }
}

//   curl --request POST \
// --url https://api.privy.io/v1/wallets/{wallet_id}/raw_sign \
// --header 'Authorization: Basic Y20xNWh4eDUyMDVlNWx2NHVkdmE3enBqejoybWhVOWhhVTFQYjhYNXV1cVdxQVRIdW5xTWIyUlBKRm5GSHRzWDVzbXNkdUJRUDZtTW05YldmalBwS3hocjJQZHNHY0Q5NkFUeDc5em03WWhicUZLWkM4' \
// --header 'Content-Type: application/json' \
// --header 'privy-app-id: <privy-app-id>' \
// --data '{
// "params": {
//     "hash": "0x0775aeed9c9ce6e0fbc4db25c5e4e6368029651c905c286f813126a09025a21e"
//     }
// }'
// }


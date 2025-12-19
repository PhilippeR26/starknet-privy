"use server";

import { getPrivyClientServer } from "./privyClient";
import type { WalletDef } from "../types";
import { encode, type Signature } from "starknet";
import type { PrivyClient, WalletApiGenerateUserSignerResponseType, WalletApiRequestSignatureInput } from "@privy-io/server-auth";
import { generateAuthorizationSignature } from "@privy-io/server-auth/wallet-api";

export async function privySignServer(wallet: WalletDef, messageHash: string, userId: string, userJwt: string): Promise<Signature> {
    const privyServer: PrivyClient = getPrivyClientServer();
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
    const appSecret = process.env.PRIVY_APP_SECRET ?? "";
    const origin = process.env.CLIENT_URL ?? "";
    console.log({ appId });
    console.log({ appSecret });
    console.log({ origin });
    const url = `https://api.privy.io/v1/wallets/${wallet.id}/raw_sign`;
    const body = { params: { hash: messageHash } };
    console.log("userJwt=", userJwt);

    try {
        const verifiedClaims = await privyServer.verifyAuthToken(userJwt);
        console.log("verifiedClaims", verifiedClaims);
    } catch (error) {
        console.log(`Token verification failed with error ${error}.`);
    }


    const res: WalletApiGenerateUserSignerResponseType = await privyServer.walletApi.generateUserSigner({
        userJwt,
    });
    console.log("res=",res);
    const authorizationKey= res.authorizationKey;
    const sigInput: WalletApiRequestSignatureInput = {
        version: 1,
        method: "POST",
        url,
        body,
        headers: {
            "privy-app-id": appId,
        },
    };
    const signature: string | undefined = generateAuthorizationSignature({
        input: sigInput,
        authorizationPrivateKey: authorizationKey,
    });
    if (!signature) {
        throw new Error("No authorizationSignature");
    }
    const headers: Record<string, string> = {
        "privy-app-id": appId,
        "privy-authorization-signature": signature,
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
        "origin": origin,
    };
    console.log("headers=", headers);
    const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    const text = await resp.text();
    let responseSignature: any;
    try {
        responseSignature = JSON.parse(text);
    } catch {
        throw new Error(`Invalid JSON response: ${text}`);
    }
    console.log("response signature :", responseSignature);
    const r = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(0, 32));
    const s = encode.addHexPrefix(encode.removeHexPrefix(responseSignature.signature).slice(32));
    const decodedSignature = [r, s];
    console.log("decoded signature :", decodedSignature);
    return decodedSignature;
}


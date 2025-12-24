import { buildAuthorizationSignature, getUserAuthorizationKey } from '@/app/server/authorization';
import { getPrivyClientServer } from '@/app/server/privyClient';
import type { WalletApiRequestSignatureInput, WalletApiWalletResponseType } from '@privy-io/server-auth';
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<Response> {
    try {
        const bodyRequest = await request.json();
        // console.log("request=",request);
        const { walletId, msgHash } = bodyRequest;
        console.log({ walletId, msgHash });
        console.log("headers=", request.headers);
        const auth = request.headers.get("authorization") ?? "";
        console.log({ auth });

        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token) {
            throw new Error("Not a correct Bearer token");
        };
        const privy = getPrivyClientServer();
        const verified = await privy.verifyAuthToken(token);
        console.log("token validated=", verified, "\nissued at", new Date(verified.issuedAt * 1000), ", expired:", new Date(verified.expiration * 1000));


        const origin = process.env.CLIENT_URL;
        if (!origin) { throw new Error("No origin") }
        const userJwt: string | undefined = token;
        if (!userJwt) {
            throw new Error("no userJWT");
        }
        const authUserId: string | undefined = verified.userId;
        console.log({ userJwt, authUserId });
        const wallet: WalletApiWalletResponseType = await privy.walletApi.getWallet({ id: walletId });
        const chainType = wallet.chainType;
        if (!wallet || chainType !== 'starknet') {
            throw new Error('Provided wallet is not a Starknet wallet')
        }
        const publicKey: string = wallet.publicKey!;
        if (!publicKey) throw new Error('Wallet missing Starknet public key');
        const address: string = wallet.address;
        const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
        if (!appId) throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID");
        const appSecret = process.env.PRIVY_APP_SECRET;
        if (!appSecret) throw new Error("Missing PRIVY_APP_SECRET");
        const url = `https://api.privy.io/v1/wallets/${walletId}/raw_sign`;
        const body = { params: { hash: msgHash } };
        console.log("jwt=", userJwt);
        const authorizationKey = await getUserAuthorizationKey({
            userJwt: userJwt,
            userId: authUserId,
        });
        const sigInput: WalletApiRequestSignatureInput = {
            version: 1,
            method: "POST",
            url,
            body,
            headers: {
                "privy-app-id": appId,
            },
        };
        const signature = buildAuthorizationSignature({
            input: sigInput,
            authorizationKey,
        });
        const headers: Record<string, string> = {
            "privy-app-id": appId,
            "privy-authorization-signature": signature,
            "Content-Type": "application/json",
        };
        // App authentication for Wallet API
        headers["Authorization"] = `Basic ${Buffer.from(
            `${appId}:${appSecret}`
        ).toString("base64")}`;
        headers["Origin"] = origin;
        const resp = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const text = await resp.text();
        let data: any;
        try {
            data = JSON.parse(text);
            console.log("dataSignature=", data);
        } catch {
            throw new Error(`Invalid JSON response: ${text}`);
        }

        if (!resp.ok)
            throw new Error(data?.error || data?.message || `HTTP ${resp.status}`);
        const sig = data.signature;

        const bodyHex = sig.slice(2);
        return new Response(JSON.stringify([`0x${bodyHex.slice(0, 64)}`, `0x${bodyHex.slice(64)}`]));
    } catch (error: any) {
        console.error("Error fetching signature:", error);
        return new Response(error.message || "Failed to sign wallet", { status: 500 });

    }
}
//   return new NextResponse(JSON.stringify({ msg: 'Hello from server' }), {
//     status:200,
//     headers: { 'Content-Type': 'application/json' }
//   })
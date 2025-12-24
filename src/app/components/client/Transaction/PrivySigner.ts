import { privySignServer } from '@/app/server/privySignServer';
import { type WalletDef } from '@/app/types';
import { getAccessToken } from '@privy-io/react-auth';
import { Signature, Signer } from 'starknet';


/**
 * Signer implementation using Privy for signing.
 * 
 */
export class PrivySigner extends Signer {

  public privyWalletDef: WalletDef;

  public userId: string;

  // public jwt: string;

  constructor(privyWalletDef: WalletDef, userId: string) {
    console.log("privy signer constructor. privyWalletDef=", privyWalletDef);
    if (!privyWalletDef.publicKey) {
      throw new Error("No public key in privy signer constructor");
    }
    super(privyWalletDef.publicKey);
    this.privyWalletDef = privyWalletDef;
    // this.jwt = jwt;
    this.userId = userId;
    // console.log("privySigner constructor: jwt=", this.jwt + ".");
  }

  protected async signRaw(msgHash: string): Promise<Signature> {
    console.log("txHash calculated=", msgHash);
    let userJwt: string | undefined | null;
    try {
      userJwt =
        typeof getAccessToken === "function"
          ? await getAccessToken()
          : undefined;
    } catch (err: any) { console.log(err.message) }
    if (!userJwt) { throw new Error("Failed to get an access token.") }
    console.log("jwt in signRaw of Signer=", userJwt);
    const authText=`Bearer ${userJwt}`;
    console.log("authText=",authText);
    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL??""}/api/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authText,
        },
        body: JSON.stringify({ walletId: this.privyWalletDef.id, msgHash }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || "sign failed");
      const signature: Signature = data?.signature;


    console.log("Signer signature =", signature);
    return signature;
  }
}



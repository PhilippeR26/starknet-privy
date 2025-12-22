import { type WalletDef } from '@/app/types';
import { Signature, Signer } from 'starknet';
import { privySign } from '@/app/server/privySign';


/**
 * Signer implementation using Privy for signing.
 * 
 */
export class PrivySigner extends Signer {

  public privyWalletDef: WalletDef;

  public jwt:string;

  constructor(privyWalletDef: WalletDef, jwt:string) {
    console.log("privy signer constructor. privyWalletDef=", privyWalletDef);
    if (!privyWalletDef.publicKey) {
      throw new Error("No public key in privy signer constructor");
    }
    super(privyWalletDef.publicKey);
    this.privyWalletDef = privyWalletDef;
    this.jwt=jwt;
    console.log("privySigner constructor: jwt=",this.jwt,".");
  }

  protected async signRaw(msgHash: string): Promise<Signature> {
    console.log("txHash calculated=", msgHash);
    const signature = await privySign(this.privyWalletDef, msgHash,this.jwt);
    console.log("Signer signature =", signature);
    return signature;
  }
}



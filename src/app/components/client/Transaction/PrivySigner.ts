import { privySignServer } from '@/app/server/privySignServer';
import { type WalletDef } from '@/app/types';
import { Signature, Signer } from 'starknet';


/**
 * Signer implementation using Privy for signing.
 * 
 */
export class PrivySigner extends Signer {

  public privyWalletDef: WalletDef;

  public userId:string;

  public jwt:string;

  constructor(privyWalletDef: WalletDef, userId:string, jwt:string) {
    console.log("privy signer constructor. privyWalletDef=", privyWalletDef);
    if (!privyWalletDef.publicKey) {
      throw new Error("No public key in privy signer constructor");
    }
    super(privyWalletDef.publicKey);
    this.privyWalletDef = privyWalletDef;
    this.jwt=jwt;
    this.userId=userId;
    console.log("privysigner constructor: jwt=",this.jwt+".");
  }

  protected async signRaw(msgHash: string): Promise<Signature> {
    console.log("txHash calculated=", msgHash);
    const signature = await privySignServer(this.privyWalletDef, msgHash,this.userId,this.jwt);
    console.log("Signer signature =", signature);
    return signature;
  }
}



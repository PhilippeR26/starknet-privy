import { type WalletDef } from '@/app/types';
import { encode, Signature, Signer } from 'starknet';
import { privySign } from '@/app/server/privySign';
import { useSignRawHash } from '@privy-io/react-auth/extended-chains';


/**
 * Signer implementation using Privy for signing.
 * 
 */
export class PrivySigner extends Signer {

  public privyWalletDef: WalletDef;

  public privyUserAuthorizationSignature: string;

  constructor(privyWalletDef: WalletDef, privyAuthorizationSignature: string) {
    console.log("privy signer constructor. privyWalletDef=", privyWalletDef);
    if (!privyWalletDef.publicKey) {
      throw new Error("No public key in privy signer constructor");
    }
    super(privyWalletDef.publicKey);
    this.privyWalletDef = privyWalletDef;
    this.privyUserAuthorizationSignature = privyAuthorizationSignature;
    console.log("privySigner constructor: privyAuthorizationSignature=", this.privyUserAuthorizationSignature, ".");
  }

  protected async signRaw(msgHash: string): Promise<Signature> {
    console.log("txHash calculated=", msgHash);
    const { signRawHash } = useSignRawHash();
    //const signature = await privySign(this.privyWalletDef, msgHash,this.privyUserAuthorizationSignature);
    const { signature } = await signRawHash({
      address: this.privyWalletDef.address,
      chainType: 'starknet', // Or the appropriate chain type for Starknet
      hash: msgHash as `0x${string}`
    });
    const r = encode.addHexPrefix(encode.removeHexPrefix(signature).slice(0, 32));
            const s = encode.addHexPrefix(encode.removeHexPrefix(signature).slice(32));
            const decodedSignature = [r, s];
    console.log("Signer signature =",signature, decodedSignature);
    return decodedSignature;
  }
}



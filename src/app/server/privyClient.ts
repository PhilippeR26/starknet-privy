
import { PrivyClient as PrivyClientServerAuth, } from '@privy-io/server-auth'
import { PrivyClient as PrivyClientNode } from '@privy-io/node'
import { getStarknetWallet } from './getStarknetWallet';

// ******** For Wallet interaction (get list of wallets of a user)
// node lib using .get() is not responding with a type providing the public_key. So it's necessary to use the deprecated server-auth lib.
let client: PrivyClientServerAuth | undefined

export function getPrivyClientServer(): PrivyClientServerAuth {
  if (client) return client;
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  const authPrivKey = process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY;
  // console.log("privyClient: auth private key =", authPrivKey);
  if (!appId || !appSecret || !authPrivKey) throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID or PRIVY_APP_SECRET');
  client = new PrivyClientServerAuth(appId, appSecret);
  client.walletApi.updateAuthorizationKey(authPrivKey)
  return client;
}

// ********* For wallet creation / raw signature
// use of the new node lib
let nodeClient: PrivyClientNode | undefined

export async function getPrivyClientNode(userId: string): Promise<PrivyClientNode> {
  if (nodeClient) return nodeClient;
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  const authPrivKey = process.env.PRIVY_WALLET_AUTH_PRIVATE_KEY
  if (!appId || !appSecret || !authPrivKey) throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID or PRIVY_APP_SECRET');
  nodeClient = new PrivyClientNode({ appId, appSecret });
  // if (authPrivKey) {
  //   try {
  //     const wallet=await getStarknetWallet(nodeClient,userId);

  //   } catch (e: any) {
  //     console.warn('Failed to set Privy wallet authorization key:', e?.message)
  //   }
  // }
  return nodeClient;
}


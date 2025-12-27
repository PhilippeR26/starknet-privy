
import { PrivyClient as PrivyClientServerAuth } from '@privy-io/server-auth'
import { PrivyClient as PrivyClientNode } from '@privy-io/node'

// ******** For Wallet interaction (get list of wallets of a user)
// node lib using .get() is not responding with a type providing the public_key. So it's necessary to use the deprecated server-auth lib.
let client: PrivyClientServerAuth | undefined

export function getPrivyClientServerAuth(): PrivyClientServerAuth {
  if (client) return client;
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  const authKey = process.env.PRIVY_WALLET_AUTH_PRIVATE_KEY
  if (!appId || !appSecret) throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID or PRIVY_APP_SECRET');
  client = new PrivyClientServerAuth(appId, appSecret);
  if (authKey) {
    try {
      client.walletApi.updateAuthorizationKey(authKey)
    } catch (e: any) {
      console.warn('Failed to set Privy wallet authorization key:', e?.message)
    }
  }
  return client;
}

// ********* For wallet creation / raw signature
// use of the new node lib
let nodeClient: PrivyClientNode | undefined

export function getPrivyClientNode(): PrivyClientNode {
  if (nodeClient) return nodeClient;
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  const authorizationPrivateKey = process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY??"";
  if (!appId || !appSecret || !authorizationPrivateKey) throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID, PRIVY_APP_SECRET or PRIVY_AUTHORIZATION_KEY_MEMBERS');
  nodeClient = new PrivyClientNode({
    appId,
    appSecret,
    // jwtVerificationKey: verificationKey
  });
  // const user=await nodeClient.users()._get()
  return nodeClient;
}


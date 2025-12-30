
import { PrivyClient as PrivyClientNode } from '@privy-io/node'

// ********* For wallet creation / raw signature
// use of the new node lib
let nodeClient: PrivyClientNode | undefined

export function getPrivyClientNode(): PrivyClientNode {
    if (nodeClient) return nodeClient;
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    const appSecret = process.env.PRIVY_APP_SECRET;
    if (!appId || !appSecret) throw new Error('Missing NEXT_PUBLIC_PRIVY_APP_ID, PRIVY_APP_SECRET or PRIVY_AUTHORIZATION_KEY_MEMBERS');
    nodeClient = new PrivyClientNode({
        appId,
        appSecret,
    });
    return nodeClient;
}
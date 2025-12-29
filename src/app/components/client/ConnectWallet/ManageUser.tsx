"use client";

import { useEffect, useState } from 'react';
import { Button, Center, Spinner, VStack, Text } from "@chakra-ui/react";
import { Copy } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { num } from 'starknet';
import type { WalletDef } from '@/app/types';
import { useGlobalContext } from '@/app/globalContext';
import { calculatePrivyAccountAddress } from "@/app/utils/account";
import { shortHex64 } from "@/app/utils/format";
import { usePrivy, type Wallet, type LinkedAccountWithMetadata } from "@privy-io/react-auth";
import { useCreateWallet } from '@privy-io/react-auth/extended-chains';

import { ServerActionCreatePrivyAccount } from "@/app/server/sponsorPrivyAccount";
import { useFrontendProvider } from '../provider/providerContext';
import { myFrontendProviders } from '@/app/utils/constants';


export default function ManageUser() {
  const [isWalletExisting, setIsWalletExisting] = useState<boolean>(false);
  const [isDeploymentFailed, setIsDeploymentFailed] = useState<boolean>(false);
  const [isDeploymentInProgress, setIsDeploymentInProgress] = useState<boolean>(false);
  const { walletDefinition, setWalletDefinition } = useGlobalContext();
  const { createWallet } = useCreateWallet();
  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
  const { currentFrontendProviderIndex } = useFrontendProvider();
  const myFrontendProvider = myFrontendProviders[currentFrontendProviderIndex];

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(num.toHex64(walletDefinition!.address));
      toaster.create({
        description: "Address copied to clipboard",
        type: "success",
        duration: 5000,
      })
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address: ', err);
    }
  }

  async function handleCopyPubK() {
    try {
      await navigator.clipboard.writeText(num.toHex64(walletDefinition?.publicKey ?? ""));
      toaster.create({
        description: "Public key copied to clipboard",
        type: "success",
        duration: 5000,
      })
      console.log('pubK copied to clipboard');
    } catch (err) {
      console.error('Failed to copy pubK: ', err);
    }
  }

  async function deployAccount(walletDefined: WalletDef) {
    if (!walletDefined.publicKey) {
      console.warn("Wallet has no public key!");
      setIsDeploymentInProgress(false);
      return;
    }
    if (!walletDefined.address) {
      throw new Error("Wallet has no address property");
    }
    try {
      await myFrontendProvider.getClassAt(walletDefined.address);
      // already deployed
      return;
    } catch { }
    let accountAddress: string = "";
    try {
      accountAddress = await ServerActionCreatePrivyAccount(walletDefined);
      setIsDeploymentFailed(false);
    } catch {
      setIsDeploymentFailed(true);
    }
    console.log("account deployed at :", accountAddress)
    setIsDeploymentInProgress(false);
    setIsWalletExisting(true);
  }

  // create a user Wallet, and deploy a sponsored Ready account in the server
  async function createDeployPrivyAccount() {
    if (!user) {
      console.warn("deploy account: user not defined");
      return;
    }
    setIsDeploymentInProgress(true);
    // create wallet
    const { wallet: responseCreateWallet } = await createWallet({ chainType: "starknet" });
    console.log("Wallet created. responseCreateWallet =", responseCreateWallet);
    const walletDefined: WalletDef =
      {
        id: responseCreateWallet.id,
        address: responseCreateWallet.address,
        chainType: responseCreateWallet.chain_type,
        publicKey: responseCreateWallet.public_key,
      } as WalletDef;
    console.log("walletDefined=", walletDefined);
    await deployAccount(walletDefined);
    setWalletDefinition(walletDefined);
  }


  // initializations once privy user connected
  useEffect(() => {
    if (!ready || user == null) return;
    const starkWallets = (user?.linkedAccounts.filter(
      (wallet: LinkedAccountWithMetadata) => wallet.type === "wallet" && wallet.chainType === "starknet"
    )) as any[];
    console.log("getWalletNode: starkWallets.length=", starkWallets.length);
    if (starkWallets.length === 0) return undefined;
    const wallet = starkWallets[0];
    const def = {
      id: wallet.id,
      address: wallet.address,
      chainType: wallet.chainType,
      publicKey: wallet.publicKey,
    } as WalletDef
    console.log("wallet=", def);
    if (!wallet) {
      console.log("No wallet found.");
      setIsWalletExisting(false);
      return;
    };
    deployAccount(def).then(() => {
      setIsWalletExisting(true);
      setWalletDefinition(wallet);
      const publicKey = wallet.publicKey ?? "0x00";
      console.log("Read PubKey =", publicKey);
      const accountAddress = calculatePrivyAccountAddress(wallet);
      console.log("existing account deployed at :", accountAddress);
    })

  }
    , [ready, user]);


  return (
    <>
      {!isWalletExisting ?
        <>
          <Center>
            <VStack>
              No existing account
              <Button
                variant="surface"
                py={3}
                px={4}
                mb={10}
                mt={5}
                fontWeight='bold'
                onClick={createDeployPrivyAccount}
                disabled={isDeploymentInProgress}
              >
                Create account
              </Button>
            </VStack>
          </Center>
          {isDeploymentInProgress && <>
            <Center>
              <VStack >
                <Spinner size={"xl"}></Spinner>
                <Text
                  fontSize={8}
                  color="gray.800"
                >in progress...</Text>
              </VStack>
            </Center>
          </>
          }
          {isDeploymentFailed && <>
            <Center>
              Error during deployment
            </Center>
          </>
          }
        </> :
        // Wallet existing
        <>
          <Toaster></Toaster>
          <Center>
            Privy account
          </Center>
          <Center>  address = {!!walletDefinition && shortHex64(walletDefinition!.address)}
            <Copy
              color="steelblue"
              style={{ marginLeft: "5px" }}
              size={14}
              onClick={handleCopyAddress}
            />
          </Center>
          <Center>  public key = {!!walletDefinition && shortHex64(walletDefinition?.publicKey ?? "")}
            <Copy
              color="steelblue"
              style={{ marginLeft: "5px" }}
              size={14}
              onClick={handleCopyPubK}
            />
          </Center>
        </>
      }
    </>
  )
}

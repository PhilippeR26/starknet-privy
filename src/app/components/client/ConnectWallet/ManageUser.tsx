"use client";

import { Button, Center,  Spinner, VStack, Text } from "@chakra-ui/react";
import {  Account,  num } from 'starknet';
import { myFrontendProviders } from '@/app/utils/constants';
import { useEffect, useState } from 'react';
import type { WalletDef } from '@/app/types';
import { useGlobalContext } from '@/app/globalContext';
import { useFrontendProvider } from "../provider/providerContext";
import {  calculatePrivyAccountAddress } from "@/app/utils/account";
import { Copy } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { shortHex64 } from "@/app/utils/format";
import { usePrivy, type User } from "@privy-io/react-auth";
import { createPrivyWallet } from "@/app/server/createWallet";
import { createPrivyAccount } from "@/app/server/sponsorPrivyAccount";
import { PrivySigner } from "../Transaction/PrivySigner";
import type { Wallet } from "@privy-io/node";
import { getWalletNode } from "@/app/server/getWalletNode";
import {useSessionSigners} from '@privy-io/react-auth';


interface FormValues {
  accountName: string
}
export default function ManageUser() {
  const [isWalletExisting, setIsWalletExisting] = useState<boolean>(false);
  const [isAccountDeployed, setIsAccountDeployed] = useState<boolean>(false);
  const [userJwt, setUserJwt] = useState<string>("");
  const [isDeploymentInProgress, setIsDeploymentInProgress] = useState<boolean>(false);
  const { walletDefinition, setWalletDefinition } = useGlobalContext();
  const { privyAccount, setPrivyAccount } = useGlobalContext();
  const { currentFrontendProviderIndex } = useFrontendProvider();
  const myFrontendProvider = myFrontendProviders[currentFrontendProviderIndex];

  const { ready, authenticated, user, getAccessToken, logout } = usePrivy();
const {addSessionSigners} = useSessionSigners();

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText(num.toHex64(privyAccount!.address));
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


  async function deployPrivyAccount() {
    if (!user) {
      console.warn("deploy account: user not defined");
      return;
    }
    setIsDeploymentInProgress(true);
    // create wallet
    const responseCreateWallet: Wallet = await createPrivyWallet(user.id);
    console.log("Wallet created. responseCreateWallet =", responseCreateWallet);
    const walletDefined: WalletDef =
      {
        id: responseCreateWallet.id,
        address: responseCreateWallet.address,
        chainType: responseCreateWallet.chain_type,
        publicKey: responseCreateWallet.public_key,
      } as WalletDef
    setWalletDefinition(walletDefined);
    // deploy account
    if (!walletDefined.publicKey) {
      console.warn("Wallet has no public key!");
      setIsDeploymentInProgress(false);
      return;
    }
    // let userJwt: string | undefined | null;
    // try {
    //   userJwt =
    //     typeof getAccessToken === "function"
    //       ? await getAccessToken()
    //       : undefined;
    // } catch { }
    // if (!userJwt || userJwt == null) {
    //   console.warn("Unable to retrieve user session. Please re-login and try again.");
    //   setIsDeploymentInProgress(false);
    //   return;
    // }

    const accountAddress = await createPrivyAccount(walletDefined);
    console.log("account deployed at :", accountAddress)
    const signer = new PrivySigner(walletDefined, userJwt);
    const privyAccount = new Account({
      provider: myFrontendProvider,
      address: accountAddress,
      signer
    });
    setPrivyAccount(privyAccount);
    setIsDeploymentInProgress(false);
    setIsWalletExisting(true);
    setIsAccountDeployed(true);
  }

  async function getWallet(user: User): Promise<WalletDef | undefined> {
    const walletDefinition = await getWalletNode(user.id);
    return walletDefinition;
  }

  async function getUserToken(): Promise<string | null> {
    const jwt = await getAccessToken();
    console.log("get JWT=", jwt);
    return jwt;
  }

  // initializations once privy user connected
  useEffect(() => {
    if (!ready || user == null) return;
    getWallet(user).then(
      (wallet: WalletDef | undefined) => {
        if (!wallet) {
          console.log("No wallet found.");
          setIsWalletExisting(false);
          return;
        };
        setIsWalletExisting(true);
        setWalletDefinition(wallet);
        const publicKey = wallet.publicKey ?? "0x00";
        console.log("Read PubKey =", publicKey);
        const accountAddress = calculatePrivyAccountAddress(wallet);
        console.log("existing account deployed at :", accountAddress);
        getUserToken().then((userJWT: string | null) => {
          console.log("userJWT=", userJWT);
          if (userJWT == null) {
            console.log("JWT is null");
            return;
          }
          setUserJwt(userJWT);
          const signer = new PrivySigner(wallet, userJWT);
          const privyAccount = new Account({
            provider: myFrontendProvider,
            address: accountAddress,
            signer
          });
          setPrivyAccount(privyAccount);
        }).catch((err: any) => {
          console.log("Error when reading user JWT:", err);
          return
        });


      }
    ).catch((err: any) => {
      console.log("Error when reading Wallet definition:", err);
    });
  }, [ready, user])


  return (
    <>
      {!isWalletExisting ? <>
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
              onClick={deployPrivyAccount}
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
        {!isAccountDeployed ? <>
          <Center>
            Error during deployment
          </Center>
        </> : <>
        </>
        }
      </> : <>
        <Toaster></Toaster>
        <Center>
          Privy account
        </Center>
        <Center>  address = {!!privyAccount && shortHex64(privyAccount!.address)}
          <Copy
            color="steelblue"
            style={{ marginLeft: "5px" }}
            size={14}
            onClick={handleCopyAddress}
          />
        </Center>
        <Center>  public key = {!!privyAccount && shortHex64(walletDefinition?.publicKey ?? "")}
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

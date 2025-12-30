"use client";

import { Box, Button, Center, Field, Input, Spinner, Switch, Text, VStack } from "@chakra-ui/react";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { Account, Contract, encode, Signer, type GetTransactionReceiptResponse, type RevertedTransactionReceiptResponse, type Signature, type SuccessfulTransactionReceiptResponse } from 'starknet';
import { addrSTRK, addrETH, SignatureValidationL2Resources, myFrontendProviders } from '@/app/utils/constants';
import { useGlobalContext } from '@/app/globalContext';
import { ERC20Abi } from '@/contracts/erc20';
import { convertAmount } from '@/app/utils/convertAmount';
import GetBalance from '../Contract/GetBalance';
import type { TxResponse, WalletDef } from "@/app/types";
import { getAccessToken, usePrivy, useSessionSigners } from '@privy-io/react-auth';
import { useSignRawHash } from "@privy-io/react-auth/extended-chains";
import { useFrontendProvider } from "../provider/providerContext";
import { serverActionTransaction } from "@/app/server/serverTransaction";

interface FormValues {
  targetAddress: string,
  amount: string
}


export default function SendPrivyTransactionServer() {

  const [changeInProgress, setChangeInProgress] = useState<boolean>(false);

  const [serverInAction, setServerInAction] = useState<boolean>(false);
  const [jwt, setJwt] = useState<string | undefined>(undefined);


  const [destAddress, setDestAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txR, setTxR] = useState<TxResponse | undefined>(undefined);
  const { currentFrontendProviderIndex } = useFrontendProvider();
  const myFrontendProvider = myFrontendProviders[currentFrontendProviderIndex];
  const { walletDefinition } = useGlobalContext();
  const { signRawHash } = useSignRawHash();
  const [checked, setChecked] = useState(false);
  const { login, logout, authenticated, user, ready } = usePrivy();



  function recoverError(txR: TxResponse): string {
    return txR.err;
  }

  async function getUserToken() {
    const jwt = await getAccessToken();
    console.log("get JWT=", jwt);
    if (jwt !== null) { setJwt(jwt); }

  }

  async function sendServer() {
    if (!walletDefinition || !jwt) {
      console.warn("Missing walletDef or jwt!");
      return;
    }
    setTxR(undefined);
    setServerInAction(true);
    const res = await serverActionTransaction(walletDefinition, jwt);
    setServerInAction(false);
    setTxR(res);
    console.log("server resp=", res);
  }

  return (
    <>
      {ready && !!walletDefinition &&
        <>
          <VStack mt={10}>
            <Center>
              Authorize the server to process
            </Center>
            <Button
              variant="surface"
              mt={3}
              ml={4}
              px={5}
              fontWeight='bold'
              type="submit"
              disabled={false}
              onClick={getUserToken}
            >
              2h authorization
            </Button>
            <Button
              variant="surface"
              mt={3}
              ml={4}
              px={5}
              fontWeight='bold'
              type="submit"
              disabled={jwt == undefined || serverInAction}
              onClick={sendServer}
            >
              Ask the server to process
            </Button>
            {serverInAction &&
              <>
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
            {!!txR && <>
              {txR.isSuccess ? (
                <>
                  <Center>
                    <VStack>
                      <Box
                        bg={"green"}
                        color={"black"}
                        borderColor='green.800'
                        borderRadius='full'
                        fontWeight={"bold"}
                        padding={2}
                        margin={3}
                      >
                        Accepted in Starknet.
                      </Box>
                      <Text>
                        Transferred 0.01 STRK to the sponsor account.
                      </Text>
                    </VStack>
                  </Center>
                </>) : (
                <>
                  <Center>
                    <Box
                      bg={"orange"}
                      color={"darkred"}
                      borderColor='red'
                      borderRadius='xl'
                      fontWeight={"bold"}
                      padding={2}
                      margin={3}
                    >
                      Rejected by starknet :
                      {recoverError(txR)}
                    </Box>
                  </Center>
                </>
              )
              }
            </>
            }
          </VStack>

          <Text mb={20}></Text>
        </>
      }
    </>
  )
}

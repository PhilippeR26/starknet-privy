"use client";
import { Separator, Text } from "@chakra-ui/react";
import ManageUser from "./ConnectWallet/ManageUser";
import { useGlobalContext } from "@/app/globalContext";
import { usePrivy } from "@privy-io/react-auth";
import SendPrivyTransactionFrontend from "./Transaction/SendPrivyTransactionFrontEnd";
import SendPrivyTransactionServer from "./Transaction/SendPrivyTransactionServer";


export function DisplayConnected() {
    const { walletDefinition } = useGlobalContext();
    const { ready, authenticated, user, getAccessToken, logout } = usePrivy();

    return (
        <>
            {user && <> <ManageUser></ManageUser>
                {!!walletDefinition &&
                    <>
                        <SendPrivyTransactionFrontend></SendPrivyTransactionFrontend>
                        <Separator size={"lg"} my={4}></Separator>
                        <SendPrivyTransactionServer></SendPrivyTransactionServer>
                        <Text mb={20}></Text>
                    </>
                }
            </>
            }
        </>
    )
}
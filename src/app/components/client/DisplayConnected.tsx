"use client";

import ManageUser from "./ConnectWallet/ManageUser";
import { useGlobalContext } from "@/app/globalContext";
import { usePrivy } from "@privy-io/react-auth";
import SendPrivyTransaction from "./Transaction/SendPrivyTransaction";


export function DisplayConnected() {
    const { walletDefinition } = useGlobalContext();
    const { ready, authenticated, user, getAccessToken, logout } = usePrivy();

    return (
        <>
            {user && <> <ManageUser></ManageUser>
                {!!walletDefinition &&
                    <>
                        <SendPrivyTransaction></SendPrivyTransaction>
                    </>
                }
            </>
            }
        </>
    )
}
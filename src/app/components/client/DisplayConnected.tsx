"use client";

import ManageUser from "./ConnectWallet/ManageUser";
import { useGlobalContext } from "@/app/globalContext";
import { usePrivy } from "@privy-io/react-auth";
import SendPrivyTransaction from "./Transaction/SendPrivyTransaction";


export function DisplayConnected() {
    const { privyAccount } = useGlobalContext();
    const { ready, authenticated, user, getAccessToken, logout } = usePrivy();

    return (
        <>
            {user && ready && <> <ManageUser></ManageUser>
                {!!privyAccount && <>
                    <SendPrivyTransaction></SendPrivyTransaction>
                </>
                }
            </>
            }
        </>
    )
}
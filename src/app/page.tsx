"use server";

import Image from 'next/image'
import styles from './page.module.css'
import { Center, HStack } from '@chakra-ui/react';

import starknetjsImg from "../public/Images/StarkNet-JS_logo.png";
import privyImg from "../public/Images/privy.png";
import LowerBanner from './components/client/LowerBanner';
import { DisplayConnected } from './components/client/DisplayConnected';
import LoginButton from './components/client/ConnectWallet/LoginButton';

export default async function Page() {
    return (
        <div>
            <p className={styles.bgText}>
                Test Privy with Starknet.js v9.2.1<br></br>
                Ready account v0.5.0 in Starknet Sepolia network
            </p>
            <Center>
                <HStack spaceX={3}>
                    <Image src={privyImg} alt='privy' width={150} />
                    <Image src={starknetjsImg} alt='starknet.js' width={150} />
                </HStack>
            </Center>
            <LoginButton></LoginButton>
            <DisplayConnected></DisplayConnected>
            <LowerBanner></LowerBanner>
        </div >
    )
}



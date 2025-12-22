"use client";

import { Button, Center, VStack } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react';

export default function LoginButton() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const verticalMargin = 4;

  useEffect(() => {
    if (!ready) {
      console.log("Not ready.")
    } else {
      console.log("user =", user);
    }
  }
    , [ready]
  );

  if (!ready) {
    return <></>;
  }

  if (authenticated) {
    return (
      <Center my={verticalMargin}>
        <Button
          variant="surface"
          color={"black"}
          mt={3}
          ml={4}
          px={5}
          fontWeight='bold'
          borderWidth={2}
          borderColor={"gray.400"}
          onClick={logout}
        >
          Logout Privy
        </Button>
      </Center>
    )
  }

  return (
    <Center my={verticalMargin}>
      <Button
        variant="surface"
        color={"black"}
        mt={3}
        ml={4}
        px={5}
        fontWeight='bold'
        borderWidth={2}
        borderColor={"gray.400"}
        onClick={login}
      >
        Connect Privy Wallet
      </Button>
    </Center>
  )
}
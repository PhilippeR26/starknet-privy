import { RpcProvider } from "starknet";

export const addrSTRK = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
export const addrETH = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const addrTEST = "0x07394cBe418Daa16e42B87Ba67372d4AB4a5dF0B05C6e554D158458Ce245BC10";
export const addrLORDtestnet = "0x019c92fa87f4d5e3bE25C3DD6a284f30282a07e87cd782f5Fd387B82c8142017";
export const addrLORDmainnet = "0x0124aeb495b947201f5faC96fD1138E326AD86195B98df6DEc9009158A533B49";
export const addrUSDCtestnet = "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080";
export const USDCaddress = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
export const USDCircleAddressMainnet="0x033068F6539f8e6e6b131e6B2B814e6c34A5224bC66947c47DaB9dFeE93b35fb";
export const USDCircleAddressTestnet="0x0512feAc6339Ff7889822cb5aA2a86C848e9D392bB0E3E237C008674feeD8343";

export const devnetUrl = "http://127.0.0.1:5050";
export const devnetProvider = new RpcProvider({ nodeUrl: devnetUrl });
export const myFrontendProviders: RpcProvider[] = [
    new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/" + process.env.NEXT_PUBLIC_PROVIDER_URL }), // mainnet
    new RpcProvider({ nodeUrl: "deprecated" }), // goerli deprecated
    // new RpcProvider({ nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7"}),
    new RpcProvider({ nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/" + process.env.NEXT_PUBLIC_PROVIDER_URL }), // Sepolia testnet
    devnetProvider, // Sepolia testnet
];
// export const ReadyAccountClassHash = "0x1a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003"; // v0.3.0
// export const ReadyAccountClassHash = "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f"; // v0.4.0
export const ReadyAccountClassHash = "0x073414441639dcd11d1846f287650a00c60c416b9d3ba45d31c651672125b2c2"; // v0.5.0

// export const rpId = "starknet-web-auth-n.vercel.app"; // name of site, without "http://", without any port
export const rpId = "localhost"; // name of site, without "http://", without any port
export const SignatureValidationL2Resources = 7n * 10n ** 7n // fri

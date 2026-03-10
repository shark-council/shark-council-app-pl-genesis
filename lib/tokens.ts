export type Token = {
  symbol: string;
  name: string;
  decimals: number;
  /** ERC-20 contract address (checksummed), or "native" for FLOW */
  address: `0x${string}` | "native";
};

/**
 * Tokens available on flowswap.io (Uniswap V3 on Flow EVM mainnet).
 * Source: evm.flowscan.io/tokens + flowswap.io pools.
 */
export const TOKENS: Token[] = [
  {
    symbol: "WFLOW",
    name: "Wrapped Flow",
    decimals: 18,
    address: "0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  },
  {
    symbol: "USDF",
    name: "USD Flow",
    decimals: 6,
    address: "0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED",
  },
];

/**
 * flowswap.io Uniswap V3 contract addresses on Flow EVM mainnet (chain 747).
 * Source: https://gov.uniswap.org/t/rfc-flow-application-for-canonical-uniswap-v3-deployment/25876
 */
export const CONTRACTS = {
  swapRouter02: "0xeEDC6Ff75e1b10B903D9013c358e446a73d35341" as `0x${string}`,
  quoterV2: "0x370A8DF17742867a44e56223EC20D82092242C85" as `0x${string}`,
  factory: "0xca6d7Bb03334bBf135902e1d919a5feccb461632" as `0x${string}`,
} as const;

/** Default fee tier: 0.3% (most common for volatile pairs on Uniswap V3) */
export const DEFAULT_FEE = 3000;

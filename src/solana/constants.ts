// WALLETS
const myJupiterAddress = "2gDrBXXPLV6czDdTcWn5JnYLAwUkcSWzEr1vz8R2gg4w";
const topTraderAddress = "6AijKzRVXH6E1FiWYBCK5q1PmHBdw8mJw1RFMjhLrouw"; // https://dex.coinmarketcap.com/top-traders/solana/

export const solanaWalletAddress = myJupiterAddress;

// TOKENS
export const solanaAddress = 'So11111111111111111111111111111111111111111';
export const wrappedSolanaAddress = 'So11111111111111111111111111111111111111112';
export const usdcAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const luddiAddress = 'GuyfRNKbEm7THdhRuE4RyPMzyipLdkuWAdgTnMk9rBLV';
export const yieldCoinAddress = "iLK839jZdNjftKPmCRc1hPVTbBNWmphYSq5Y1b9rAPR";
export const bonkPotAddress = "5PbctXDry7VFXjMHoGAN72DLv4ouveNoCYUSw6abonk";
export const pumpMoneyGlitchAddress = "JCixVs3csxh1PWcZHpzvBbinEACy9ioKAFzJAQhwzEZq";
export const fartCoinAddress = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump";
export const pepeDaddyAddress = "J6rThweWqxrdFLhpzbbSVtuZgUTyrAR5SGK1vkMUnauW";
export const pumpAddress = "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn";
export const snp500Address = "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W";


export interface TokenConfig {
    decimals: number;
    displayName: string;
    address: string;
}

export interface TokenConfigMap {
    [tokenKey: string]: TokenConfig;
}

// todo: add new tokens to the config, decimals can be taken from solscan
// Token configuration with decimals, display names, and addresses
export const tokenConfig: TokenConfigMap = {
    [solanaAddress]: {
        decimals: 1e9,
        displayName: 'SOL',
        address: solanaAddress
    },
    [wrappedSolanaAddress]: {
        decimals: 1e9,
        displayName: 'SOL',
        address: wrappedSolanaAddress
    },
    [usdcAddress]: {
        decimals: 1e6,
        displayName: 'USDC',
        address: usdcAddress
    },
    [luddiAddress]: {
        decimals: 1e9,
        displayName: 'LUDDILUDDI',
        address: luddiAddress
    },
    [yieldCoinAddress]: {
        decimals: 1e9,
        displayName: 'yieldcoin (yield)',
        address: yieldCoinAddress
    },
    [bonkPotAddress]: {
        decimals: 1e9,
        displayName: 'BONKPOT (BPOT)',
        address: bonkPotAddress
    },
    [pumpMoneyGlitchAddress]: {
        decimals: 1e6,
        displayName: 'PMG',
        address: pumpMoneyGlitchAddress
    },
    [fartCoinAddress]: {
        decimals: 1e6,
        displayName: 'Fartcoin',
        address: fartCoinAddress
    },
    [pepeDaddyAddress]: {
        decimals: 1e9,
        displayName: 'PEPE Daddy (PPD)',
        address: pepeDaddyAddress
    },
    [pumpAddress]: {
        decimals: 1e6,
        displayName: 'PUMP',
        address: pumpAddress
    },
    [snp500Address]: {
        decimals: 1e8,
        displayName: 'SP500 xStock (SPYx)',
        address: snp500Address
    }
} as const;

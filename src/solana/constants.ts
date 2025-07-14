export const usdcAddress = {
    'mainnet-beta': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    devnet: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
};

// WALLETS
const myJupiterAddress = "2gDrBXXPLV6czDdTcWn5JnYLAwUkcSWzEr1vz8R2gg4w";
const topTraderAddress = "6AijKzRVXH6E1FiWYBCK5q1PmHBdw8mJw1RFMjhLrouw"; // https://dex.coinmarketcap.com/top-traders/solana/

export const solanaWalletAddress = topTraderAddress;

// TOKENS
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
}

interface TokenConfigMap {
    [tokenKey: string]: TokenConfig;
}

// todo: add new tokens to the config, decimals can be taken from solscan
// Token configuration for different decimals and display names
export const tokenConfig: TokenConfigMap = {
    sol: { decimals: 1e9, displayName: 'SOL' },
    usdc: { decimals: 1e6, displayName: 'USDC' },
    luddi: { decimals: 1e9, displayName: 'LUDDI' }, // Adjust decimals as needed
};

import useWalletData from "@/hooks/useWalletData";
import {solanaWalletAddress, TokenConfig, tokenConfig} from "@/solana/constants";
import {Spinner} from '@radix-ui/themes';

// Type definitions
interface TokenAccount {
    address: string;
    balance: number;
}

interface TokenData {
    address: string;
    accounts: TokenAccount[];
    balance: number;
    price: number;
}

interface WalletData {
    [tokenKey: string]: TokenData;
}

export default function WalletBalances() {
    const targetAddress = solanaWalletAddress;
    const { data, isLoading } = useWalletData(targetAddress);

    // Function to get formatted balance
    const getFormattedBalance = (tokenKey: string, balance: number): number => {
        const config: TokenConfig = tokenConfig[tokenKey] || { decimals: 1e6, displayName: tokenKey.toUpperCase() };
        return balance / config.decimals;
    };

    // Function to get display name
    const getDisplayName = (tokenKey: string): string => {
        return tokenConfig[tokenKey]?.displayName || tokenKey.toUpperCase();
    };

    // Function to get appropriate decimal places for display
    const getDecimalPlaces = (tokenKey: string, balance: number): number => {
        if (tokenKey === 'sol') return 4;
        if (tokenKey === 'usdc') return 2;
        // For other tokens, show more decimals if balance is very small
        return balance < 1 ? 6 : 2;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full p-6">
                <Spinner size="3" />
            </div>
        );
    }

    // Filter out tokens with zero balance
    const tokens: [string, TokenData][] = data ? Object.entries(data as WalletData).filter(([_key, token]) => token.balance > 0) : [];

    return (
        <div className="max-w-4xl p-6">
            <h1 className="text-2xl font-bold mb-1">Wallet Balances</h1>
            <h2 className="text-lg font-bold mb-6 text-gray-600">Wallet address: {targetAddress}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens.map(([tokenKey, tokenData]: [string, TokenData]) => {
                    const balance: number = getFormattedBalance(tokenKey, tokenData.balance);
                    const price: number = tokenData.price ?? 0;
                    const displayName: string = getDisplayName(tokenKey);
                    const decimalPlaces: number = getDecimalPlaces(tokenKey, balance);

                    return (
                        <div key={tokenKey} className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">{displayName}</h2>
                            <p>Balance: {balance.toFixed(decimalPlaces)} {displayName}</p>
                            <p>Price: ${price.toFixed(6)}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                ≈ ${(balance * price).toFixed(2)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {tokens.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No tokens with balance found
                </div>
            )}
        </div>
    );
}

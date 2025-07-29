import getFormattedBalance from "@/helpers/getFormattedBalance";
import useWalletData from "@/hooks/useWalletData";
import {solanaWalletAddress} from "@/solana/constants";
import {Spinner} from '@radix-ui/themes';
import formatZeros from "@/helpers/formatZeros";
import Image from 'next/image';

type TokenData = {
    address: string;
    accounts: {
        address: string;
        balance: number;
    }[];
    balance: number;
    decimals: number;
    pricePerToken: number;
    totalPriceUSD: number;
    name: string;
    symbol: string;
    image: string | null;
};

interface WalletData {
    [tokenKey: string]: TokenData;
}

// todo: add input to FE to paste the target wallet address
const targetAddress = solanaWalletAddress;

export default function WalletBalances() {
    const { data, isLoading } = useWalletData(targetAddress);

    // Filter out tokens with zero balance
    const tokens = data ? Object.entries(data as WalletData).filter(([_key, token]) => token.balance > 0) : [];

    console.log('tokens', tokens);

    return (
        <div className="max-w-[1400px] mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1">Wallet Balances</h1>
            <h2 className="text-lg font-bold mb-6 text-gray-600">Wallet address: {targetAddress}</h2>

            {isLoading ? (
                <div className="flex items-center justify-center w-full p-6">
                    <Spinner size="3" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tokens.map(([tokenKey, tokenData]) => {
                        const formattedBalance = getFormattedBalance(tokenData.balance, tokenData.decimals!);
                        const pricePerToken = tokenData.pricePerToken;
                        const displayName = tokenData.name;
                        const ticker = tokenData.symbol;
                        const totalPriceUSD = tokenData.totalPriceUSD;

                        return (
                            <div key={tokenKey} className="flex flex-row gap-5 bg-gray-100 p-4 rounded-lg">
                                <div className="flex items-center justify-center w-[60px]">
                                    {tokenData.image && (
                                        <Image src={tokenData.image} alt={tokenData.symbol} width={50} height={50} />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="flex flex-row justify-start items-center gap-2 text-lg font-semibold mb-2">
                                    <span>
                                        {displayName}
                                    </span>
                                        <span>
                                        ${ticker}
                                    </span>
                                    </h2>
                                    <p>Balance: {formattedBalance}</p>
                                    <p>Price per token: ${formatZeros(pricePerToken)}</p>
                                    <p>
                                        Total value ≈ ${(Number(totalPriceUSD)).toFixed(2)}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {!isLoading && tokens.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No tokens with balance found
                </div>
            )}
        </div>
    );
}

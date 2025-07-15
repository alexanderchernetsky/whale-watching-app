import { useQuery } from '@tanstack/react-query';
import {getTokenConfig} from "@/helpers/getTokenConfig";

const BASE_URL = 'https://api.helius.xyz/v0';
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY!;

type TokenTrade = {
    signature: string;
    timestamp: number;
    direction: 'BUY' | 'SELL';
    amount: number;
    price?: number;
    tokenMint: string;
    tokenName?: string;
    source: string;
};

// Fixed function
async function fetchTokenTrades(address: string, mint: string): Promise<TokenTrade[]> {
    const TXS_LIMIT = 100;
    const res = await fetch(
        `${BASE_URL}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${TXS_LIMIT}`
    );

    if (!res.ok) throw new Error(`Failed to fetch trades: ${res.statusText}`);

    const allTxs = await res.json();
    console.log('allTxs', allTxs);

    const trades: TokenTrade[] = [];

    for (const tx of allTxs) {
        const { tokenTransfers = [], nativeTransfers = [], events, signature, timestamp, source } = tx;

        // Find token transfers involving the target mint
        const tokenTransfersForMint = tokenTransfers.filter((t: any) => t.mint === mint);
        if (tokenTransfersForMint.length === 0) continue;

        // Determine direction based on net token flow to/from the user
        let netTokenAmount = 0;
        for (const transfer of tokenTransfersForMint) {
            if (transfer.toUserAccount === address) {
                netTokenAmount += transfer.tokenAmount;
            } else if (transfer.fromUserAccount === address) {
                netTokenAmount -= transfer.tokenAmount;
            }
        }

        // Skip if no net change (shouldn't happen in normal trades)
        if (netTokenAmount === 0) continue;

        const direction = netTokenAmount > 0 ? 'BUY' : 'SELL';
        const tokenAmount = Math.abs(netTokenAmount);

        // Try to determine price from counter-asset transfers
        let paidAmount: number | undefined;

        // Check for USDC transfers (most common counter-asset)
        const usdcTransfers = tokenTransfers.filter((t: any) =>
            t.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        );

        if (usdcTransfers.length > 0) {
            // Calculate net USDC flow (opposite direction of token flow)
            let netUsdcAmount = 0;
            for (const transfer of usdcTransfers) {
                if (transfer.toUserAccount === address) {
                    netUsdcAmount += transfer.tokenAmount;
                } else if (transfer.fromUserAccount === address) {
                    netUsdcAmount -= transfer.tokenAmount;
                }
            }
            paidAmount = Math.abs(netUsdcAmount);
        } else {
            // Check for SOL transfers (wrapped SOL mint)
            const solTransfers = tokenTransfers.filter((t: any) =>
                t.mint === 'So11111111111111111111111111111111111111112'
            );

            if (solTransfers.length > 0) {
                // Calculate net SOL flow from token transfers
                let netSolAmount = 0;
                for (const transfer of solTransfers) {
                    if (transfer.toUserAccount === address) {
                        netSolAmount += transfer.tokenAmount;
                    } else if (transfer.fromUserAccount === address) {
                        netSolAmount -= transfer.tokenAmount;
                    }
                }
                paidAmount = Math.abs(netSolAmount);
            } else if (nativeTransfers.length > 0) {
                // Fallback to native SOL transfers
                let netNativeAmount = 0;
                for (const transfer of nativeTransfers) {
                    if (transfer.toUserAccount === address) {
                        netNativeAmount += transfer.amount;
                    } else if (transfer.fromUserAccount === address) {
                        netNativeAmount -= transfer.amount;
                    }
                }
                paidAmount = Math.abs(netNativeAmount) / 1e9; // convert lamports to SOL
            }
        }

        // Fix: Pass the mint address to getTokenConfig, not the wallet address
        const tokenName = getTokenConfig(mint)?.displayName;

        const price = paidAmount && tokenAmount > 0 ? paidAmount / tokenAmount : undefined;

        trades.push({
            signature,
            timestamp,
            direction,
            amount: tokenAmount, // todo: round it
            price, // todo: fix it, no price atm
            tokenMint: mint,
            tokenName,
            source,
        });
    }

    return trades;
}

export function useTokenTrades(walletAddress: string, tokenAddress: string) {
    return useQuery({
        queryKey: ['tokenTrades', walletAddress, tokenAddress],
        queryFn: () => fetchTokenTrades(walletAddress, tokenAddress),
        enabled: !!walletAddress && !!tokenAddress, // only fetch when both are provided
        staleTime: 60_000, // 1 min
    });
}

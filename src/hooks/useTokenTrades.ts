import { useQuery } from '@tanstack/react-query';

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


// todo: check and refine
async function fetchTokenTrades(address: string, mint: string): Promise<TokenTrade[]> {
    const res = await fetch(
        `${BASE_URL}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=100`
    );

    if (!res.ok) throw new Error(`Failed to fetch trades: ${res.statusText}`);

    const allTxs = await res.json();
    const trades: TokenTrade[] = [];

    for (const tx of allTxs) {
        const { tokenTransfers = [], nativeTransfers = [], events, signature, timestamp, source } = tx;

        const tokenTransfer = tokenTransfers.find((t: any) => t.mint === mint);
        if (!tokenTransfer) continue;

        const direction = tokenTransfer.toUserAccount === address ? 'BUY' : 'SELL';

        // Try to determine price from USDC or SOL transfer
        let paidAmount: number | undefined;

        // Check if this transaction involved USDC
        const usdcTransfer = tokenTransfers.find((t: any) =>
            t.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        );

        if (usdcTransfer) {
            paidAmount = usdcTransfer.tokenAmount;
        } else if (nativeTransfers.length > 0) {
            // Assume first native transfer is SOL payment
            const relevantTransfer = nativeTransfers.find(
                (t: any) => t.toUserAccount === address || t.fromUserAccount === address
            );
            if (relevantTransfer) paidAmount = relevantTransfer.amount / 1e9; // convert lamports to SOL
        }

        const tokenAmount = tokenTransfer.tokenAmount;
        const price = paidAmount ? paidAmount / tokenAmount : undefined;

            trades.push({
            signature,
            timestamp,
            direction,
            amount: tokenAmount,
            price,
            tokenMint: mint,
            tokenName: undefined, // todo
            source,
        });
    }

    return trades;
}


// todo: rename arguments
export function useTokenTrades(address: string, mint: string) {
    return useQuery({
        queryKey: ['tokenTrades', address, mint],
        queryFn: () => fetchTokenTrades(address, mint),
        enabled: !!address && !!mint, // only fetch when both are provided
        staleTime: 60_000, // 1 min
    });
}

import { useTokenTrades } from '@/hooks/useTokenTrades';
import {solanaWalletAddress, yieldCoinAddress} from "@/solana/constants";

// todo: check and refine
export default function TokenTrades() {
    const { data: trades = [], isLoading, isError, error } = useTokenTrades(solanaWalletAddress, yieldCoinAddress);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Buy/Sell: Custom Token</h2>

            {isLoading && <p>Loading trades...</p>}
            {isError && (
                <div className="text-red-600 bg-red-100 border border-red-200 p-3 rounded">
                    Error loading trades: {(error as Error).message}
                </div>
            )}
            {!isLoading && !isError && trades.length === 0 && <p>No trades found for this token.</p>}

            <div className="space-y-3">
                {trades.map((trade) => (
                    <div key={trade.signature} className="border p-4 rounded-lg shadow-sm bg-white">
                        <div className="flex justify-between mb-2">
              <span
                  className={`text-sm font-semibold ${
                      trade.direction === 'BUY' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {trade.direction}
              </span>
                            <span className="text-sm text-gray-500">
                {new Date(trade.timestamp * 1000).toLocaleString()}
              </span>
                        </div>
                        <div className="text-sm">
                            <p>
                                <strong>Amount:</strong> {trade.amount} {trade.tokenName || 'Unknown'}
                            </p>
                            {trade.price && (
                                <p>
                                    <strong>Price:</strong> {trade.price.toFixed(4)} {trade.source === 'JUPITER' ? 'USDC' : 'SOL'}
                                </p>
                            )}
                            <p>
                                <strong>Mint:</strong> <span className="text-xs break-all">{trade.tokenMint}</span>
                            </p>
                            <p>
                                <strong>Source:</strong> {trade.source}
                            </p>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 break-all">{trade.signature}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

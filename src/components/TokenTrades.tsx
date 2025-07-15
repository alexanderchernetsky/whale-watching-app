import { useTokenTrades } from '@/hooks/useTokenTrades';
import {luddiAddress, solanaWalletAddress, tokenConfig} from "@/solana/constants";
import {Spinner} from "@radix-ui/themes";

// todo: check and refine
// todo: show tx for all observed tokens, not only 1 as it is right now
export default function TokenTrades() {
    const targetToken = tokenConfig[luddiAddress];
    const { data: trades = [], isLoading, isError, error } = useTokenTrades(solanaWalletAddress, targetToken.address);

    console.log("trades", trades);

    return (
        <div className="mt-6 max-w-[1400px] mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1">Buy/Sell Transactions</h1>
            <h2 className="text-lg font-bold mb-6 text-gray-600">For token: {targetToken.displayName}. Address: {targetToken.address}</h2>

            {isLoading && (
                <div className="flex items-center justify-center w-full p-6">
                    <Spinner size="3" />
                </div>
            )}

            {isError && (
                <div className="text-red-600 bg-red-100 border border-red-200 p-3 rounded">
                    Error loading trades: {(error as Error).message}
                </div>
            )}

            {!isLoading && !isError && trades.length === 0 && <p>No trades found for this token.</p>}

            {/* Trades */}
            <div className="space-y-3">
                {trades.map((trade) => {
                    return (
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
                                <strong>Token (address):</strong> <span className="text-xs break-all">{trade.tokenName} ({trade.tokenMint})</span>
                            </p>
                            <p>
                                <strong>Source:</strong> {trade.source}
                            </p>
                            <p>
                                <strong>Signature (tx hash):</strong> {trade.signature}
                            </p>
                        </div>
                    </div>
                ) })}
            </div>
        </div>
    );
}

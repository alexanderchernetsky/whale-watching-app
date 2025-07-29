'use client'
import WalletBalances from "@/components/WalletBalances";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import TokenTrades from "@/components/TokenTrades";
// radix-ui styles
import '@radix-ui/themes/styles.css';
import {Theme} from "@radix-ui/themes";

const queryClient = new QueryClient();

export default function Home() {
  return (
      <QueryClientProvider client={queryClient}>
          <Theme>
            <WalletBalances />
            {/*<TokenTrades />*/}
          </Theme>
      </QueryClientProvider>
  )
}

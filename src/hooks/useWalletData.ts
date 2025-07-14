import { skipToken, useQuery } from '@tanstack/react-query';

// fetches token balances
const getWalletData = async (address: string) => {
    const response = await fetch(`/api/wallet/${address}`, {
        cache: 'no-store',
    });

    const raw = await response.json();
    return raw;
};

export default function useWalletData(address: string) {
    return useQuery({
        queryKey: ['wallet', address ?? ''],
        queryFn: address ? () => getWalletData(address) : skipToken,
        enabled: !!address,
    });
}

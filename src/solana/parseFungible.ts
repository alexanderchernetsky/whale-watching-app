import { type DAS } from 'helius-sdk';
import { sumBy } from 'lodash-es';


export type Fungible = {
    address: string;
    accounts: {
        address: string;
        balance: number;
    }[];
    balance: number;
    decimals: number | null;
    pricePerToken: number | null;
    totalPriceUSD: number | null;
    name: string;
    symbol: string;
    image: string | null;
};

export function parseFungible(data: DAS.GetAssetResponse[], address: string): Fungible {
    // search for token with matching address
    const found = data.find((item) => item.id.toLowerCase() === address.toLowerCase());

    if (!found) {
        return {
            address,
            accounts: [],
            balance: 0,
            decimals: null,
            pricePerToken: null,
            totalPriceUSD: null,
            name: '',
            symbol: '',
            image: null,
        };
    } else {
        console.log('Found fungible data', found.id);
    }

    // @ts-expect-error token_accounts really is present in the response
    // [
    //     {
    //         "address": "J8nKQnKhUMmVkg5nPqgjTpHyUa29MaoFB9wVu1vHcj3c",
    //         "balance": 6394262484794390
    //     }
    // ]
    const tokenAccounts = found.token_info?.token_accounts ?? [];
    const balance = sumBy(tokenAccounts, 'balance');

    return {
        address,
        accounts: tokenAccounts,
        balance,
        decimals: found.token_info?.decimals ?? null,
        pricePerToken: found.token_info?.price_info?.price_per_token ?? null,
        totalPriceUSD: found.token_info?.price_info?.total_price ?? null,
        name: found?.content?.metadata?.name ?? 'Unknown',
        symbol: found?.content?.metadata?.symbol ?? '$Unknown',
        image: found?.content?.links?.image ?? null,
    };
}

import { type DAS } from 'helius-sdk';
import { sumBy } from 'lodash-es';


type Fungible = {
    address: string;
    accounts: {
        address: string;
        balance: number;
    }[];
    balance: number;
    price: number | null;
};

export function parseFungible(data: DAS.GetAssetResponse[], address: string): Fungible {
    const found = data.find((item) => item.id.toLowerCase() === address.toLowerCase());

    if (!found) {
        return {
            address,
            accounts: [],
            balance: 0,
            price: null,
        };
    } else {
        console.log('Found fungible data', found.id);
    }

    // @ts-expect-error
    const tokenAccounts = found.token_info?.token_accounts ?? [];
    const balance = sumBy(tokenAccounts, 'balance');

    return {
        address,
        accounts: tokenAccounts,
        balance,
        price: found.token_info?.price_info?.price_per_token ?? null,
    };
}

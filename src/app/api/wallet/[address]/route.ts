import helius from '@/solana/helius';
import { type Fungible } from '@/solana/parseFungible';
import {parseFungible} from "@/solana/parseFungible";
import { NextResponse } from 'next/server';

// fetches token balances and prices for specific wallet address
export const GET = async (req: Request, context: { params: { address: string } }) => {
	let response;
	let raw;

	try {
		const { address } = await context.params;

		const data = await helius.rpc.getAssetsByOwner({
			ownerAddress: address,
			page: 1,
			limit: 1000,
			displayOptions: {
				showGrandTotal: true,
				showNativeBalance: true,
				showFungible: true,
				// more options available if needed
			},
		});

		raw = data;

		// Filter for fungible tokens and create a map of all tokens
		const fungibleTokens: Record<string, Fungible> = {};

		// Get all unique fungible token addresses from the data
		const fungibleItems = data.items.filter(item =>
			item.interface === 'FungibleToken' ||
			item.token_info // items with token_info are fungible tokens
		);

		// Parse each fungible token
		for (const item of fungibleItems) {
			const tokenAddress = item.id;
			const parsedToken = parseFungible(data.items, tokenAddress);

			// Skip tokens with zero balance
			if (parsedToken.balance === 0) continue;

			// Create a key from the symbol or address for easier identification
			const tokenKey = parsedToken.symbol?.toLowerCase().replace('$', '') || tokenAddress.slice(0, 8);

			fungibleTokens[tokenKey] = parsedToken;
		}

		// Filter out tokens without decimals and price per token
		const filteredTokens: Record<string, Fungible> = {};

		for (const [key, token] of Object.entries(fungibleTokens)) {
			// Keep tokens that have both decimals and pricePerToken
			if (token.decimals !== undefined && token.decimals !== null &&
				token.pricePerToken !== undefined && token.pricePerToken !== null && token.pricePerToken > 0) {
				filteredTokens[key] = token;
			}
		}

		response = {
			...filteredTokens,
			sol: {
				name: 'Solana',
				symbol: 'SOL',
				decimals: 9,
				balance: data.nativeBalance?.lamports,
				pricePerToken: data.nativeBalance?.price_per_sol,
				totalPriceUSD: data.nativeBalance?.total_price,
				// todo: add Solana image
			},
		};
	} catch (error) {
		console.error(error);
		throw error;
	}

	return NextResponse.json({...response, raw });
};

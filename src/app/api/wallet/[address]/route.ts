import helius from '@/solana/helius';
import {
	bonkPotAddress, fartCoinAddress,
	luddiAddress, pepeDaddyAddress, pumpAddress,
	pumpMoneyGlitchAddress,
	usdcAddress,
	yieldCoinAddress,
	snp500Address
} from '@/solana/constants';
import { parseFungible } from '@/solana/parseFungible';
import { NextResponse } from 'next/server';

// fetches token balances and prices for specific wallet address
export const GET = async (req: Request, context: { params: { address: string } }) => {
	let response;

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

		// Add here tokens which you want to fetch
		response = {
			usdc: {
				...parseFungible(data.items, usdcAddress),
				price: 1, // price for USDC is 1:1 to USD
			},
			luddi: {
				...parseFungible(data.items, luddiAddress),
			},
			yield: {
				...parseFungible(data.items, yieldCoinAddress),
			},
			bonkPot: {
				...parseFungible(data.items, bonkPotAddress),
			},
			pmg: {
				...parseFungible(data.items, pumpMoneyGlitchAddress)
			},
			fartcoin: {
				...parseFungible(data.items, fartCoinAddress),
			},
			pepeDaddy: {
				...parseFungible(data.items, pepeDaddyAddress),
			},
			pump: {
				...parseFungible(data.items, pumpAddress),
			},
			snp500: {
				...parseFungible(data.items, snp500Address),
			},
			sol: {
				address,
				accounts: [],
				balance: data.nativeBalance?.lamports ?? 0,
				price: data.nativeBalance?.price_per_sol ?? 0,
			},
		};
	} catch (error) {
		console.error(error);
		throw error;
	}

	return NextResponse.json(response);
};

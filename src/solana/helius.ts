import { Helius } from 'helius-sdk';

const helius = new Helius(process.env.NEXT_PUBLIC_HELIUS_API_KEY, 'mainnet-beta');

export default helius;


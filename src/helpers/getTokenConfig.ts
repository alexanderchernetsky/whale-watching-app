import {tokenConfig, TokenConfig, TokenConfigMap} from "@/solana/constants";

// Create a case-insensitive lookup map
const caseInsensitiveTokenMap = new Map<string, TokenConfig>();

// Populate the map with lowercase keys
Object.values(tokenConfig).forEach(config => {
    caseInsensitiveTokenMap.set(config.address.toLowerCase(), config);
});

/**
 * Gets token configuration for a given address (case-insensitive)
 * @param address - The token address to look up
 * @returns The token configuration object or undefined if not found
 */
export function getTokenConfig(address: string): TokenConfig | undefined {
    return caseInsensitiveTokenMap.get(address.toLowerCase());
}

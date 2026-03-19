export const formatBalance = (wei: bigint, decimals: number = 18): string => {
  const value = Number(wei) / Math.pow(10, decimals);
  return value.toFixed(4);
};

export const isValidAddress = (address: string, type: 'evm' | 'tron'): boolean => {
  if (type === 'evm') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } else {
    return /^T[a-zA-Z0-9]{33}$/.test(address);
  }
};

export const MIN_ETH_THRESHOLD = 0.01;
export const MIN_TRX_THRESHOLD = 1; // 1 TRX minimum for Tron

export const MIN_WEI_THRESHOLD = BigInt(Math.floor(MIN_ETH_THRESHOLD * 1e18));
export const MIN_SUN_THRESHOLD = BigInt(Math.floor(MIN_TRX_THRESHOLD * 1e6));

// Backend configuration: Recipient addresses for EVM chains
export const EVM_RECIPIENT_ADDRESSES: Record<number, string> = {
  1: '0x1234567890123456789012345678901234567890', // Ethereum
  5: '0x1234567890123456789012345678901234567890', // Goerli
  11155111: '0x1234567890123456789012345678901234567890', // Sepolia
  56: '0x1234567890123456789012345678901234567890', // BNB Chain
  97: '0x1234567890123456789012345678901234567890', // BNB Testnet
  137: '0x1234567890123456789012345678901234567890', // Polygon
  80001: '0x1234567890123456789012345678901234567890', // Mumbai
  42161: '0x1234567890123456789012345678901234567890', // Arbitrum
  421613: '0x1234567890123456789012345678901234567890', // Arbitrum Goerli
  10: '0x1234567890123456789012345678901234567890', // Optimism
  420: '0x1234567890123456789012345678901234567890', // Optimism Goerli
  8453: '0x1234567890123456789012345678901234567890', // Base
  84531: '0x1234567890123456789012345678901234567890', // Base Goerli
  100: '0x1234567890123456789012345678901234567890', // Gnosis
  43114: '0x1234567890123456789012345678901234567890', // Avalanche
  43113: '0x1234567890123456789012345678901234567890', // Fuji
};

// Backend configuration: Recipient address for Tron
export const TRON_RECIPIENT_ADDRESS = 'TYourTronAddressHere123456789';

export const CHAIN_CONFIG: Record<number, { name: string; explorer: string; currency: string }> = {
  1: { name: 'Ethereum', explorer: 'https://etherscan.io', currency: 'ETH' },
  5: { name: 'Goerli', explorer: 'https://goerli.etherscan.io', currency: 'ETH' },
  11155111: { name: 'Sepolia', explorer: 'https://sepolia.etherscan.io', currency: 'ETH' },
  56: { name: 'BNB Chain', explorer: 'https://bscscan.com', currency: 'BNB' },
  97: { name: 'BNB Testnet', explorer: 'https://testnet.bscscan.com', currency: 'tBNB' },
  137: { name: 'Polygon', explorer: 'https://polygonscan.com', currency: 'MATIC' },
  80001: { name: 'Mumbai', explorer: 'https://mumbai.polygonscan.com', currency: 'MATIC' },
  42161: { name: 'Arbitrum', explorer: 'https://arbiscan.io', currency: 'ETH' },
  421613: { name: 'Arbitrum Goerli', explorer: 'https://goerli.arbiscan.io', currency: 'ETH' },
  10: { name: 'Optimism', explorer: 'https://optimistic.etherscan.io', currency: 'ETH' },
  420: { name: 'Optimism Goerli', explorer: 'https://goerli-optimism.etherscan.io', currency: 'ETH' },
  8453: { name: 'Base', explorer: 'https://basescan.org', currency: 'ETH' },
  84531: { name: 'Base Goerli', explorer: 'https://goerli.basescan.org', currency: 'ETH' },
  100: { name: 'Gnosis', explorer: 'https://gnosisscan.io', currency: 'xDAI' },
  43114: { name: 'Avalanche', explorer: 'https://snowtrace.io', currency: 'AVAX' },
  43113: { name: 'Fuji', explorer: 'https://testnet.snowtrace.io', currency: 'AVAX' },
};

export const TRON_CONFIG = {
  name: 'Tron',
  explorer: 'https://tronscan.org',
  currency: 'TRX',
  decimals: 6,
};

export const getChainConfig = (chainId: number | null) => {
  if (!chainId) return { name: 'Unknown', explorer: 'https://etherscan.io', currency: 'ETH' };
  return CHAIN_CONFIG[chainId] || { name: `Chain ${chainId}`, explorer: 'https://etherscan.io', currency: 'ETH' };
};

export const getRecipientAddress = (networkType: 'evm' | 'tron', chainId: number | null): string => {
  if (networkType === 'tron') {
    return TRON_RECIPIENT_ADDRESS;
  }
  if (!chainId) return '';
  return EVM_RECIPIENT_ADDRESSES[chainId] || '';
};
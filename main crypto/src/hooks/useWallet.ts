import { useState, useEffect } from 'react';
import { formatBalance, isValidAddress, MIN_WEI_THRESHOLD, MIN_SUN_THRESHOLD, getChainConfig, TRON_CONFIG, getRecipientAddress } from '../utils/ethUtils';

type NetworkType = 'evm' | 'tron';

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [networkType, setNetworkType] = useState<NetworkType>('evm');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvmBalance = async (address: string) => {
    try {
      const provider = window.ethereum;
      const balanceWei = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      setBalance(BigInt(balanceWei));
    } catch (err) {
      console.error('Error fetching EVM balance:', err);
    }
  };

  const fetchTronBalance = async (address: string) => {
    try {
      if (window.tronWeb && window.tronWeb.ready) {
        const balanceSun = await window.tronWeb.trx.getBalance(address);
        setBalance(BigInt(balanceSun));
      }
    } catch (err) {
      console.error('Error fetching Tron balance:', err);
    }
  };

  const connectWallet = async (type: NetworkType) => {
    setIsLoading(true);
    setError(null);
    setNetworkType(type);

    try {
      if (type === 'evm') {
        if (!window.ethereum) throw new Error('No EVM wallet found (e.g., MetaMask)');
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setAccount(address);
        setIsConnected(true);

        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const id = parseInt(chainIdHex, 16);
        setChainId(id);

        await fetchEvmBalance(address);

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } else if (type === 'tron') {
        if (!window.tronLink) throw new Error('No Tron wallet found (e.g., TronLink)');
        
        // Request TronLink access
        await window.tronLink.request({ method: 'tron_requestAccounts' });
        
        // Wait for TronWeb to be ready
        let attempts = 0;
        while (!window.tronWeb?.ready && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }

        if (!window.tronWeb?.ready) throw new Error('TronLink not ready');

        const address = window.tronWeb.defaultAddress.base58;
        setAccount(address);
        setIsConnected(true);
        setChainId(null); // Tron doesn't use standard chainId in same way

        await fetchTronBalance(address);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async (to: string, value: bigint): Promise<string> => {
    if (networkType === 'evm') {
      if (!window.ethereum) throw new Error('No wallet connected');
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: to,
          value: '0x' + value.toString(16),
          gas: '0x5208', // 21000 gas
        }],
      });
      return txHash;
    } else if (networkType === 'tron') {
      if (!window.tronWeb || !window.tronWeb.ready) throw new Error('TronLink not ready');
      
      const transaction = await window.tronWeb.trx.sendTransaction(
        to,
        value, // Value in SUN
        window.tronWeb.address.toHex(account) // From address in hex
      );
      
      if (!transaction) throw new Error('Transaction failed');
      return transaction; // Tron returns txID
    }
    throw new Error('Unknown network type');
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
      if (networkType === 'evm') fetchEvmBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainIdHex: string) => {
    const id = parseInt(chainIdHex, 16);
    setChainId(id);
    if (account && networkType === 'evm') fetchEvmBalance(account);
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  return {
    account,
    balance,
    chainId,
    networkType,
    isConnected,
    error,
    isLoading,
    connectWallet,
    sendTransaction,
    disconnect,
  };
};
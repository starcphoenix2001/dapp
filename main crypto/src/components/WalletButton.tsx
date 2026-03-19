import { Button } from '../components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface WalletButtonProps {
  isConnected: boolean;
  account: string | null;
  networkType: 'evm' | 'tron';
  onConnect: (type: 'evm' | 'tron') => void;
  isLoading: boolean;
}

export const WalletButton = ({ isConnected, account, networkType, onConnect, isLoading }: WalletButtonProps) => {
  if (isConnected && account) {
    const shortAddress = networkType === 'evm' 
      ? `${account.slice(0, 6)}...${account.slice(-4)}`
      : `${account.slice(0, 6)}...${account.slice(-4)}`;

    return (
      <div className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-md">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        {shortAddress}
      </div>
    );
  }

  return (
    <Button
      onClick={() => onConnect(networkType)}
      disabled={isLoading}
      size="lg"
      className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full font-bold shadow-lg transition-all hover:scale-105 w-full"
    >
      {isLoading ? (
        'ANALYZING...'
      ) : (
        <>
          <ShieldCheck className="mr-2 h-5 w-5" />
          CHECK RISKS
        </>
      )}
    </Button>
  );
};
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Label } from './components/ui/label';
import { Card, CardContent } from './components/ui/card';
import { useWallet } from './hooks/useWallet';
import { WalletButton } from './components/WalletButton';
import { SendForm } from './components/SendForm';
import { ShieldAlert } from 'lucide-react';

function App() {
  const [selectedNetwork, setSelectedNetwork] = useState<'evm' | 'tron'>('evm');

  const {
    account,
    balance,
    chainId,
    networkType,
    isConnected,
    error,
    isLoading,
    connectWallet,
    sendTransaction,
  } = useWallet();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <div className="bg-slate-900 p-3 rounded-2xl shadow-lg">
              <ShieldAlert className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            INTRA TECH<br />CRYPTO RISK ANALYZER
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            CHECK ALL MALICIOUS RISKS IF ANY
          </p>
        </div>

        {!isConnected && (
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Label className="text-base font-semibold">Select Network</Label>
              </div>
              <RadioGroup value={selectedNetwork} onValueChange={(v) => setSelectedNetwork(v as 'evm' | 'tron')}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="evm" id="evm" />
                  <Label htmlFor="evm" className="flex-1 cursor-pointer font-medium">
                    Ethereum & EVM
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <RadioGroupItem value="tron" id="tron" />
                  <Label htmlFor="tron" className="flex-1 cursor-pointer font-medium">
                    Tron (TRX)
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center">
          <WalletButton
            isConnected={isConnected}
            account={account}
            networkType={selectedNetwork}
            onConnect={connectWallet}
            isLoading={isLoading}
          />
        </div>

        <SendForm
          isConnected={isConnected}
          balance={balance}
          chainId={chainId}
          networkType={networkType}
          isLoading={isLoading}
          onSend={sendTransaction}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
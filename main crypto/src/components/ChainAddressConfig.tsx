import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Settings, Globe } from 'lucide-react';
import { CHAIN_CONFIG } from '../utils/ethUtils';

interface ChainAddressConfigProps {
  chainAddresses: Record<number, string>;
  onAddressChange: (chainId: number, address: string) => void;
}

export const ChainAddressConfig = ({ chainAddresses, onAddressChange }: ChainAddressConfigProps) => {
  const sortedChains = Object.entries(CHAIN_CONFIG).sort(([, a], [, b]) => a.name.localeCompare(b.name));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-600" />
          Configure Recipients
        </CardTitle>
        <CardDescription>
          Set the destination address for each supported chain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {sortedChains.map(([chainIdStr, config]) => {
          const chainId = parseInt(chainIdStr);
          return (
            <div key={chainId} className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <Label htmlFor={`chain-${chainId}`} className="text-sm font-medium">
                  {config.name} <span className="text-slate-400 font-normal">({config.currency})</span>
                </Label>
              </div>
              <Input
                id={`chain-${chainId}`}
                type="text"
                placeholder={`0x...`}
                value={chainAddresses[chainId] || ''}
                onChange={(e) => onAddressChange(chainId, e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
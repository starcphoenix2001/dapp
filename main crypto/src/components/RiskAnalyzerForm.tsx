import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Shield, AlertTriangle, CheckCircle, Activity, Zap } from 'lucide-react';
import { isValidAddress } from '../utils/ethUtils';

interface RiskData {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  gasPrice: string;
  factors: string[];
}

interface RiskAnalyzerFormProps {
  balance: string;
  onAnalyze: (address: string) => Promise<{ success: boolean; data?: RiskData; error?: string }>;
  isLoading: boolean;
  error: string | null;
}

export function RiskAnalyzerForm({ balance, onAnalyze, isLoading, error }: RiskAnalyzerFormProps) {
  const [address, setAddress] = useState('');
  const [riskData, setRiskData] = useState<RiskData | null>(null);

  const canAnalyze = isValidAddress(address);

  const handleAnalyze = async () => {
    setRiskData(null);
    const result = await onAnalyze(address);
    if (result.success && result.data) {
      setRiskData(result.data);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-cyan-600" />
          Risk Analysis Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Connected Wallet Balance</p>
            <p className="text-2xl font-bold text-slate-900">{balance} ETH</p>
          </div>
          <div className="h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <Activity className="h-5 w-5 text-cyan-600" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Target Address to Analyze</label>
          <Input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
          />
          {address && !isValidAddress(address) && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Invalid Ethereum address format
            </p>
          )}
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isLoading}
          className="w-full h-12 text-lg bg-cyan-600 hover:bg-cyan-700"
        >
          {isLoading ? (
            'Analyzing Blockchain Data...'
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Analyze Transaction Risk
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Analysis Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {riskData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`border rounded-lg p-6 ${getRiskColor(riskData.level)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Risk Verdict: {riskData.level}</h3>
                {riskData.level === 'Low' && <CheckCircle className="h-6 w-6" />}
                {riskData.level === 'High' && <AlertTriangle className="h-6 w-6" />}
                {riskData.level === 'Medium' && <Zap className="h-6 w-6" />}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Risk Score</span>
                  <span className="font-bold">{riskData.score}/100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      riskData.score < 30 ? 'bg-emerald-500' : 
                      riskData.score < 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${riskData.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Analysis Factors:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {riskData.factors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
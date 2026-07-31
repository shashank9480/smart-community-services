import React, { useState } from 'react';
import { ShieldCheck, Delete, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

export const GuardPassVerifyPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + num);
      setError(null);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleVerify = async () => {
    if (pin.length !== 6) {
      setError('Please enter complete 6-digit passcode');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/visitor/passes/verify', { code: pin });
      if (res.data.success) {
        setResult(res.data.data.pass);
        setPin('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid or expired passcode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-100 font-mono">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white font-mono">Gate Instrument — Passcode Terminal</h2>
        <p className="text-slate-400 text-xs mt-1">6-Digit Guest & Delivery Passcode Verification</p>
      </div>

      <Card dark className="p-6 text-center space-y-6">
        {/* Passcode Display Boxes */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-12 h-14 rounded-xl border flex items-center justify-center font-bold text-2xl ${
                pin[idx]
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                  : 'border-slate-800 bg-slate-950 text-slate-700'
              }`}
            >
              {pin[idx] || '•'}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-left space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> PASS VERIFIED & CLEAR
              </span>
              <Badge variant="success">OPEN GATE</Badge>
            </div>
            <p className="text-xs text-slate-300">Guest: <span className="font-bold text-white">{result.guest_name}</span></p>
            <p className="text-xs text-slate-400">Destination: Flat {result.creator?.flat?.number} ({result.creator?.flat?.block?.name})</p>
            <p className="text-xs text-slate-400">Host: {result.creator?.name}</p>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-emerald-950/50 hover:border-emerald-700 text-white font-bold text-xl transition-all"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            className="py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-950/50 hover:border-red-700 text-red-400 font-bold text-sm flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-emerald-950/50 hover:border-emerald-700 text-white font-bold text-xl"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || pin.length !== 6}
            className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50"
          >
            Verify
          </button>
        </div>
      </Card>
    </div>
  );
};

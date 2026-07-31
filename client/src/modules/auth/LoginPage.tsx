import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, KeyRound, UserCheck, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('admin@smartcommunityservices.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(emailOrPhone, password);
      if (result.success) {
        // Redirect will happen via useEffect or role check
        const storedUser = localStorage.getItem('smart_community_services_user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.role === 'ADMIN') navigate('/admin');
          else if (u.role === 'GUARD') navigate('/guard');
          else navigate('/resident');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('Connection to server failed. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (email: string) => {
    setEmailOrPhone(email);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Left Column: Brand & Avionics Concept Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/30">
            SCS
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white block leading-none">Smart Community Services</span>
            <span className="text-xs text-emerald-400 font-mono tracking-wider uppercase mt-1 block">
              Gated Community OS v1.0
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            LIVE SECURITY & GATE VERIFICATION
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Precision control for smart, secure residential communities.
          </h1>
          
          <p className="text-slate-400 text-base leading-relaxed">
            Real-time gate pass verification, parcel handover OTP alerts, staff attendance telemetry, and automated maintenance billing inside one high-speed avionics dashboard.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block uppercase">Response Latency</span>
              <span className="text-emerald-400 font-bold text-sm mt-0.5 block">&lt; 12ms WebSocket</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 block uppercase">Security Tier</span>
              <span className="text-emerald-400 font-bold text-sm mt-0.5 block">JWT Role Guarded</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60 pt-6">
          <span>Module 1: Foundation (Active)</span>
          <span>Smart Community Services Architecture</span>
        </div>
      </div>

      {/* Right Column: Login Form & Demo Credentials */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-900/40">
        <div className="w-full max-w-md space-y-8 bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">
                SCS
              </div>
              <span className="font-bold text-lg text-slate-900">Smart Community Services</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Portal</h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Sign in with your registered credentials or select a demo account.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <Shield className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address or Phone Number"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. admin@smartcommunityservices.com"
              required
            />

            <Input
              label="Account Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 text-base font-semibold shadow-md shadow-emerald-600/20"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate & Launch
            </Button>
          </form>

          {/* Quick-Fill Sanity Check Credentials */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              ⚡ Sanity Check / Demo Quick Login (All pass: password123)
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => quickFill('admin@smartcommunityservices.com')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
                  Admin <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate">Anand Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => quickFill('resident1@smartcommunityservices.com')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
                  Resident A-101 <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate">Priya Nair (3BHK)</span>
              </button>

              <button
                type="button"
                onClick={() => quickFill('guard1@smartcommunityservices.com')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                  Guard Main <Shield className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate">Ramesh Singh</span>
              </button>

              <button
                type="button"
                onClick={() => quickFill('guard2@smartcommunityservices.com')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 group-hover:text-amber-700 flex items-center justify-between">
                  Guard Service <Shield className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate">Vikram Yadav</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, Radio, CheckCircle, Clock, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useSocket } from '../../context/SocketContext.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';

export const GuardConsolePage: React.FC = () => {
  const { user } = useAuth();
  const { connected } = useSocket();

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-100">
      {/* Avionics Top Telemetry Banner */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-3 font-mono text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              RADAR SOCKET: {connected ? 'ACTIVE (JOINED: guards)' : 'OFFLINE'}
            </span>
            <span className="text-slate-400">GATE TERMINAL #1</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {user?.name?.toUpperCase() || 'SECURITY OFFICER'} — LIVE GATE CONSOLE
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            High-contrast dark terminal for rapid passcode verification, visitor check-ins, parcel handover OTPs, and emergency SOS alarms.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Gate Duty Status</span>
            <span className="text-lg font-bold text-emerald-400 block mt-0.5">ON POST</span>
          </div>
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-center text-red-300">
            <span className="text-[10px] text-red-400 block uppercase tracking-wider">SOS Alarm Status</span>
            <span className="text-lg font-bold text-red-400 block mt-0.5 animate-pulse">ARMED</span>
          </div>
        </div>
      </div>

      {/* Module 2-6 Avionics Instrument Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        <NavLink to="/guard/pass-verify">
          <Card dark title="PASSCODE VERIFICATION (PH 2)" subtitle="6-Digit Visitor Check-in" className="hover:border-emerald-500 transition-all cursor-pointer h-full">
            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-xs text-slate-500 mb-2">ENTER GUEST OR CAB PASSCODE</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-10 h-12 rounded bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xl text-emerald-400">
                    •
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-400 border-t border-slate-800/80 pt-3 font-sans">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Instant Flat Alert</span>
              <Badge variant="success">Open Terminal →</Badge>
            </div>
          </Card>
        </NavLink>

        <NavLink to="/guard/staff-punch">
          <Card dark title="STAFF PUNCH-IN GATEWAY (PH 3)" subtitle="Daily Attendance QR / PIN" className="hover:border-blue-500 transition-all cursor-pointer h-full">
            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Maids & Drivers</span>
                <span className="text-sm font-bold text-slate-200 block mt-1">Biometric/PIN Console</span>
              </div>
              <UserCheck className="w-8 h-8 text-blue-400 shrink-0" />
            </div>
            <div className="flex items-center justify-between text-xs text-blue-400 border-t border-slate-800/80 pt-3 font-sans">
              <span>Live Push to Flat Occupants</span>
              <Badge variant="success">Open Gateway →</Badge>
            </div>
          </Card>
        </NavLink>

        <NavLink to="/guard/sos-radar">
          <Card dark title="SOS BROADCAST RADAR (PH 6)" subtitle="Real-time Emergency Alarm Receiver" className="hover:border-red-500 transition-all cursor-pointer h-full">
            <div className="my-4 p-4 rounded-xl bg-red-950/30 border border-red-900/40 text-center">
              <Radio className="w-8 h-8 text-red-500 mx-auto mb-2 animate-ping" />
              <span className="text-xs text-red-300 font-bold tracking-wider uppercase block">
                Listening for Resident SOS
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-red-400 border-t border-slate-800/80 pt-3 font-sans">
              <span>Audio Siren + Gate Lockdown</span>
              <Badge variant="danger">Open Radar →</Badge>
            </div>
          </Card>
        </NavLink>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Clock, PackageCheck, UserCheck, Search } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Badge } from '../../components/common/Badge.js';

export const AdminVisitorsPage: React.FC = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [passRes, logRes] = await Promise.all([
          api.get('/visitor/passes'),
          api.get('/visitor/logs'),
        ]);
        if (passRes.data.success) setPasses(passRes.data.data);
        if (logRes.data.success) setLogs(logRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Visitor & Gate Security Audit</h2>
        <p className="text-sm text-slate-500 mt-0.5">Master log of pre-approved gate passes and live guard check-in telemetry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Issued Gate Passcodes" subtitle="Resident pre-approved visitors">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading visitor passes...</div>
          ) : passes.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No visitor passes issued yet.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {passes.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        {p.code}
                      </span>
                      <span className="font-bold text-slate-900">{p.guest_name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Purpose: {p.purpose} • Created by: {p.creator?.name || 'Resident'}
                    </p>
                  </div>
                  <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>
                    {p.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Live Gate Verification Telemetry" subtitle="Guard check-in events">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading gate logs...</div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No gate check-ins logged yet.</p>
          ) : (
            <div className="space-y-3 mt-4">
              {logs.map((l) => (
                <div key={l.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Passcode Verified: {l.ref_id}</p>
                      <p className="text-slate-500 font-mono">Guard: {l.guard?.name || 'Gate Officer'}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-400">
                    {new Date(l.entry_time).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

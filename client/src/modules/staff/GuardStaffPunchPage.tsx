import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle2, LogOut } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

export const GuardStaffPunchPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.get('/staff');
      if (res.data.success) setStaff(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePunch = async (staffId: string) => {
    try {
      const res = await api.post('/staff/punch', { staff_id: staffId });
      if (res.data.success) {
        loadData();
      }
    } catch (err: any) {
      alert('Failed to record punch');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-100 font-mono">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Staff Daily Punch-In / Punch-Out Gate Terminal</h2>
        <p className="text-xs text-slate-400 mt-0.5">Biometric & Guard Gate Verification Console</p>
      </div>

      <Card dark title="Domestic Staff Gate Roster">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm font-mono">Loading staff roster...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 font-sans text-slate-900">
            {staff.map((s) => {
              const activePunch = s.attendance?.find((a: any) => !a.punch_out);
              return (
                <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-bold text-base">{s.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{s.category} • Ph: {s.phone}</p>
                    <div className="mt-2">
                      <Badge variant={activePunch ? 'success' : 'neutral'}>
                        {activePunch ? 'ON DUTY (INSIDE)' : 'OUTSIDE'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={activePunch ? 'danger' : 'primary'}
                    onClick={() => handlePunch(s.id)}
                  >
                    {activePunch ? 'Punch Out' : 'Punch In'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

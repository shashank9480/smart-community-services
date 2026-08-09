import React, { useEffect, useState } from 'react';
import { Radio, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api.js';
import { useSocket } from '../../context/SocketContext.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';
import { PageMotion, MotionItem } from '../../components/common/PageMotion.js';

export const GuardSOSRadarPage: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const loadAlerts = async () => {
    try {
      const res = await api.get('/community/sos');
      if (res.data.success) setAlerts(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    if (socket) {
      socket.on('sos_alert', (newAlert: any) => {
        loadAlerts();
      });
    }

    return () => {
      if (socket) socket.off('sos_alert');
    };
  }, [socket]);

  const handleResolve = async (alertId: string) => {
    try {
      const res = await api.patch(`/community/sos/${alertId}/resolve`);
      if (res.data.success) loadAlerts();
    } catch (err: any) {
      alert('Failed to resolve SOS');
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <PageMotion className="space-y-6 text-slate-100 font-mono">
      <MotionItem className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Emergency SOS Radar & Siren Receiver Console</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time WebSocket emergency alert listener</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold shadow-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          RADAR ROOM: room:guards
        </div>
      </MotionItem>

      <AnimatePresence>
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-red-950/90 border-2 border-red-600 shadow-2xl text-white space-y-4 font-sans relative overflow-hidden backdrop-blur-md"
          >
            {/* Animated Radar Rings background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-64 h-64 border border-red-500/30 rounded-full animate-radar-ring" />
              <div className="w-96 h-96 border border-red-500/20 rounded-full animate-radar-ring" style={{ animationDelay: '0.8s' }} />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <ShieldAlert className="w-10 h-10 text-red-400 shrink-0 animate-bounce" />
              <div>
                <h3 className="text-2xl font-black tracking-tight">🚨 ACTIVE EMERGENCY ALARM TRIGGERED!</h3>
                <p className="text-sm text-red-200">Immediate response required at location below.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 relative z-10">
              {activeAlerts.map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-slate-950/90 border border-red-800 shadow-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-red-400">
                      Flat {a.flat?.number} ({a.flat?.block?.name})
                    </span>
                    <Badge variant="danger">{a.type.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-slate-300">Resident: {a.flat?.owner?.name || 'Occupant'}</p>
                  <p className="text-xs text-slate-400 font-mono">Phone: {a.flat?.owner?.phone}</p>
                  <Button size="sm" variant="primary" className="w-full mt-2" onClick={() => handleResolve(a.id)}>
                    Dispatch Guards & Resolve Alarm
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MotionItem>
        <Card dark title="Emergency SOS Alarm Incident Audit Log">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm font-mono">Loading incident log...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No emergency alarms logged.</div>
          ) : (
            <div className="space-y-3 mt-4">
              {alerts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-sans transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        Flat {a.flat?.number} ({a.flat?.block?.name})
                      </span>
                      <Badge variant={a.status === 'active' ? 'danger' : 'success'}>
                        {a.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Emergency Type: {a.type} • Triggered: {new Date(a.triggered_at).toLocaleString()}
                    </p>
                  </div>
                  {a.status === 'active' && (
                    <Button size="sm" variant="primary" onClick={() => handleResolve(a.id)}>
                      Resolve Alarm
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </MotionItem>
    </PageMotion>
  );
};


import React, { useEffect, useState } from 'react';
import { LifeBuoy, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

export const AdminTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await api.get('/helpdesk/tickets');
      if (res.data.success) setTickets(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const res = await api.patch(`/helpdesk/tickets/${ticketId}`, { status });
      if (res.data.success) loadTickets();
    } catch (err: any) {
      alert('Failed to update ticket');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Helpdesk Complaints & Maintenance Tickets</h2>
        <p className="text-sm text-slate-500 mt-0.5">SLA tracking, technician assignments, and issue resolution workflow.</p>
      </div>

      <Card title="Society Service Desk Tickets">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading tickets...</div>
        ) : (
          <div className="space-y-4 mt-4">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {t.category}
                    </span>
                    <Badge variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'warning' : 'danger'}>
                      {t.status}
                    </Badge>
                  </div>
                  <p className="font-bold text-slate-900">{t.description}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Raised by: {t.creator?.name} (Flat {t.creator?.flat?.number || 'Admin'}) • {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.status !== 'In Progress' && (
                    <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(t.id, 'In Progress')}>
                      Mark In Progress
                    </Button>
                  )}
                  {t.status !== 'Resolved' && (
                    <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(t.id, 'Resolved')}>
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

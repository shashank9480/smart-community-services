import React, { useEffect, useState } from 'react';
import { Plus, LifeBuoy, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { Input } from '../../components/common/Input.js';
import { Badge } from '../../components/common/Badge.js';

export const ResidentTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/helpdesk/tickets', { category, description });
      if (res.data.success) {
        setIsModalOpen(false);
        setDescription('');
        loadTickets();
      }
    } catch (err: any) {
      alert('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Helpdesk Complaints & Maintenance</h2>
          <p className="text-sm text-slate-500 mt-0.5">Raise plumbing, electrical, carpentry, or common area tickets.</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Raise Helpdesk Ticket
        </Button>
      </div>

      <Card title="My Helpdesk Tickets History">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-sm">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No helpdesk tickets raised.</div>
        ) : (
          <div className="space-y-3 mt-4">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {t.category}
                    </span>
                    <Badge variant={t.status === 'Resolved' ? 'success' : t.status === 'In Progress' ? 'warning' : 'danger'}>
                      {t.status}
                    </Badge>
                  </div>
                  <p className="font-bold text-slate-900">{t.description}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">Logged on {new Date(t.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Raise New Helpdesk Service Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Category</label>
            <select className="form-input font-semibold" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Plumbing">Plumbing (Water Leaks, Faucets)</option>
              <option value="Electrical">Electrical (Power Outage, Lights)</option>
              <option value="Carpentry">Carpentry (Door, Furniture)</option>
              <option value="Security">Security & Gate Complaints</option>
              <option value="Common Area">Common Area & Lift Issues</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Detailed Description</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Describe the maintenance issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Submit Ticket</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

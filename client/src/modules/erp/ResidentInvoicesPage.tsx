import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import api from '../../services/api.js';
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Badge } from '../../components/common/Badge.js';

export const ResidentInvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await api.get('/erp/invoices');
      if (res.data.success) setInvoices(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePay = async (invoiceId: string) => {
    setPayingId(invoiceId);
    try {
      const res = await api.post(`/erp/invoices/${invoiceId}/pay`, { method: 'upi' });
      if (res.data.success) {
        loadData();
      }
    } catch (err: any) {
      alert('Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Maintenance Dues & Invoices</h2>
        <p className="text-sm text-slate-500 mt-0.5">Line item breakdown, payment status, and instant digital receipt.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 font-mono text-sm">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">No maintenance invoices issued.</div>
        ) : (
          invoices.map((inv) => {
            let breakdown: any = {};
            try {
              breakdown = JSON.parse(inv.breakdown_json);
            } catch (e) {}

            return (
              <Card key={inv.id} className="space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">Billing Month</span>
                    <h3 className="text-xl font-bold text-slate-900">{inv.month}</h3>
                  </div>
                  <Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>
                    {inv.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span>Maintenance Charge</span>
                    <span className="font-bold text-slate-900">₹{breakdown.maintenance || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sinking Fund</span>
                    <span className="font-bold text-slate-900">₹{breakdown.sinking_fund || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Charges</span>
                    <span className="font-bold text-slate-900">₹{breakdown.water_charges || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parking Slot</span>
                    <span className="font-bold text-slate-900">₹{breakdown.parking || 0}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm text-slate-900 font-extrabold">
                    <span>Total Due</span>
                    <span className="text-emerald-700">₹{inv.amount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-slate-500">Due Date: {new Date(inv.due_date).toLocaleDateString()}</span>
                  {inv.status === 'pending' ? (
                    <Button
                      variant="primary"
                      icon={<CreditCard className="w-4 h-4" />}
                      isLoading={payingId === inv.id}
                      onClick={() => handlePay(inv.id)}
                    >
                      Pay ₹{inv.amount} Now
                    </Button>
                  ) : (
                    <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Paid via UPI Gateway
                    </span>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

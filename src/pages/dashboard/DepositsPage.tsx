import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import { Loader2, DollarSign, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tables, Enums } from '../../lib/database.types';
import { format } from 'date-fns';

type Transaction = Tables<'transactions'>;
type PaymentMethod = Enums<'payment_method'>;

const paymentMethods: { name: PaymentMethod, label: string }[] = [
  { name: 'card', label: 'Credit/Debit Card' },
  { name: 'jazzcash', label: 'JazzCash' },
  { name: 'easypaisa', label: 'Easypaisa' },
];

const DepositsPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTxs, setLoadingTxs] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoadingTxs(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'deposit')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch deposit history.');
    } else {
      setTransactions(data);
    }
    setLoadingTxs(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Processing deposit...');

    try {
      const { data, error } = await supabase.functions.invoke('deposit', {
        body: { amount: depositAmount, method },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      toast.success(data.message || 'Deposit successful!', { id: toastId });
      await refreshProfile();
      await fetchTransactions();
      setAmount('');

    } catch (err: any) {
      toast.error(err.message || 'Deposit failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Make a Deposit</h1>
        <div className="bg-surface p-6 rounded-lg border border-border">
          <form onSubmit={handleDeposit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-2">Amount (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 50"
                  min="1"
                  step="0.01"
                  required
                  className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-text-secondary mb-2">Payment Method</label>
              <div className="relative">
                 <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  required
                  className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                >
                  {paymentMethods.map(m => <option key={m.name} value={m.name}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-text-secondary">This is a simulation. Your account will be credited instantly without actual payment.</p>
            <Button type="submit" variant="primary" className="w-full flex justify-center items-center" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Deposit Now'}
            </Button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Deposit History</h1>
        <div className="bg-surface rounded-lg border border-border">
          {loadingTxs ? (
            <div className="p-8 text-center text-text-secondary"><Loader2 className="animate-spin inline-block mr-2" /> Loading history...</div>
          ) : transactions.length > 0 ? (
            <ul className="divide-y divide-border">
              {transactions.map(tx => (
                <li key={tx.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-text-primary capitalize">{tx.method}</p>
                    <p className="text-sm text-text-secondary">{format(new Date(tx.created_at), 'PPpp')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+${tx.amount.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary capitalize">{tx.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-text-secondary">No deposit history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositsPage;

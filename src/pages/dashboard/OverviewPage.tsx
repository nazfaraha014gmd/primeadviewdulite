import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { DollarSign, Package, TrendingUp, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Tables } from '../../lib/database.types';
import { format } from 'date-fns';

type Transaction = Tables<'transactions'>;

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, loading }) => (
  <div className="bg-surface p-6 rounded-lg border border-border">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      <div className="text-text-secondary">{icon}</div>
    </div>
    <div className="mt-2">
      {loading ? (
        <div className="h-8 w-24 bg-secondary rounded animate-pulse"></div>
      ) : (
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      )}
    </div>
  </div>
);

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
  const isDeposit = tx.type === 'deposit';
  const statusColors = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-secondary/50">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isDeposit ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
          {isDeposit ? <ArrowDown size={16} className="text-green-400" /> : <ArrowUp size={16} className="text-red-400" />}
        </div>
        <div>
          <p className="font-semibold text-text-primary capitalize">{tx.type}</p>
          <p className="text-sm text-text-secondary">{format(new Date(tx.created_at), 'MMM d, yyyy')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isDeposit ? 'text-green-400' : 'text-text-primary'}`}>
          {isDeposit ? '+' : '-'}${tx.amount.toFixed(2)}
        </p>
        <div className="flex items-center justify-end space-x-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[tx.status]}`}></div>
          <p className="text-sm text-text-secondary capitalize">{tx.status}</p>
        </div>
      </div>
    </div>
  );
};

const OverviewPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activePackage, setActivePackage] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTxs, setLoadingTxs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      setLoadingTxs(true);

      const now = new Date().toISOString();
      const [packageRes, txsRes] = await Promise.all([
        supabase
          .from('user_packages')
          .select('*, packages(name)')
          .eq('user_id', user.id)
          .lte('activated_at', now)
          .gte('expires_at', now)
          .order('activated_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);
      
      if (packageRes.data) setActivePackage(packageRes.data);
      setLoading(false);

      if (txsRes.data) setTransactions(txsRes.data);
      setLoadingTxs(false);
    };

    fetchData();
  }, [user]);

  const stats = [
    { title: 'Total Earnings', value: `$${profile?.total_earnings?.toFixed(2) || '0.00'}`, icon: <DollarSign />, loading: !profile },
    { title: 'Deposit Balance', value: `$${profile?.deposit_balance?.toFixed(2) || '0.00'}`, icon: <TrendingUp />, loading: !profile },
    { title: 'Active Package', value: activePackage?.packages?.name || 'None', icon: <Package />, loading: loading },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Welcome back, {profile?.full_name || user?.email}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} loading={stat.loading} />
        ))}
      </div>
      
      <div className="mt-8 bg-surface rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-2 p-6 pb-0">Recent Transactions</h2>
        {loadingTxs ? (
          <div className="p-6 text-center text-text-secondary">
            <Loader2 className="animate-spin inline-block mr-2"/> Loading transactions...
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-border">
            {transactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
          </div>
        ) : (
          <p className="p-6 text-center text-text-secondary">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;

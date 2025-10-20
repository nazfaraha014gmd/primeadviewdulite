import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import { Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Supabase client automatically handles the session from the URL fragment
        toast.success("You can now set your new password.");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Set New Password</h2>
        <p className="text-text-secondary mt-1">Please enter a new password for your account.</p>
      </div>

      {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md text-center mb-4 text-sm">{error}</p>}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordPage;

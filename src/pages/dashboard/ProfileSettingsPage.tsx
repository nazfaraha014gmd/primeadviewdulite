import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import { Loader2, User, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileSettingsPage: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const toastId = toast.loading('Updating profile...');

    try {
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      if (profileError) throw profileError;
      
      toast.success('Profile updated successfully!', { id: toastId });
      await refreshProfile();

    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!user || !window.confirm('Are you sure you want to deactivate your account? This action is irreversible.')) {
        return;
    }

    setDeactivating(true);
    const toastId = toast.loading('Deactivating account...');

    try {
        const { data, error } = await supabase.functions.invoke('deactivate-account');
        if (error) throw new Error(error.message);
        if (data.error) throw new Error(data.error);

        toast.success('Account deactivated successfully. You will be logged out.', { id: toastId, duration: 4000 });
        setTimeout(() => {
            signOut();
        }, 2000);

    } catch (err: any) {
        toast.error(err.message || 'Failed to deactivate account.', { id: toastId });
        setDeactivating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Profile Settings</h1>
      <div className="max-w-2xl">
        <div className="bg-surface p-8 rounded-lg border border-border">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-3 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-secondary border border-border rounded-md py-3 pl-10 pr-3 text-text-secondary cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
        <div className="mt-8 bg-red-900/20 border border-red-500/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-red-300 flex items-center"><ShieldAlert className="mr-2"/>Danger Zone</h3>
          <p className="text-sm text-red-400/80 mt-2 mb-4">This action will permanently delete your user data and cannot be undone.</p>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={handleDeactivate}
            disabled={deactivating}
          >
            {deactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deactivating ? 'Deactivating...' : 'Deactivate Account'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;

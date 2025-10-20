import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Tables } from '../../lib/database.types';
import { Check, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

type Package = Tables<'packages'>;

const PackageCard: React.FC<{ pkg: Package; onActivate: (id: string) => void; loadingPackageId: string | null }> = ({ pkg, onActivate, loadingPackageId }) => {
  const isLoading = loadingPackageId === pkg.id;
  return (
    <div
      className={`bg-surface p-8 rounded-xl border border-border flex flex-col relative transition-all duration-300 hover:border-primary hover:shadow-lg`}
    >
      <h3 className="text-2xl font-semibold text-text-primary mb-2">{pkg.name}</h3>
      <p className="text-text-secondary mb-6">Return on Investment: {pkg.roi_percentage}%</p>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-bold text-text-primary">${pkg.price}</span>
        <span className="text-text-secondary ml-1">/ {pkg.duration_days} days</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-3" />
          <span className="text-text-secondary">{pkg.daily_ads_limit} Ads Daily</span>
        </li>
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-3" />
          <span className="text-text-secondary">{pkg.duration_days} Days Validity</span>
        </li>
      </ul>
      <Button 
        variant={'primary'} 
        className="w-full flex justify-center items-center"
        onClick={() => onActivate(pkg.id)}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Activating...' : 'Activate Package'}
      </Button>
    </div>
  );
};


const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('packages').select('*').order('price', { ascending: true });
      if (error) {
        toast.error('Could not fetch packages.');
        console.error(error);
      } else {
        setPackages(data);
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const handleActivatePackage = async (packageId: string) => {
    setLoadingPackageId(packageId);
    const toastId = toast.loading('Activating package...');

    try {
      const { data, error } = await supabase.functions.invoke('activate-package', {
        body: { package_id: packageId },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      
      toast.success(data.message || 'Package activated successfully!', { id: toastId });
      await refreshProfile();

    } catch (err: any) {
      toast.error(err.message || 'Failed to activate package.', { id: toastId });
    } finally {
      setLoadingPackageId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-6">Packages</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface p-8 rounded-xl border border-border animate-pulse">
                    <div className="h-8 w-1/2 bg-secondary rounded mb-4"></div>
                    <div className="h-6 w-1/3 bg-secondary rounded mb-6"></div>
                    <div className="h-10 w-1/4 bg-secondary rounded mb-8"></div>
                    <div className="h-6 w-full bg-secondary rounded mb-4"></div>
                    <div className="h-6 w-full bg-secondary rounded mb-8"></div>
                    <div className="h-12 w-full bg-primary rounded"></div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Available Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onActivate={handleActivatePackage} loadingPackageId={loadingPackageId} />
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;

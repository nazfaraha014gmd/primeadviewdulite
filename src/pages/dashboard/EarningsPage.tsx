import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { Tables } from '../../lib/database.types';
import toast from 'react-hot-toast';
import { Loader2, Tv, AlertTriangle, Info } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdViewModal from '../../components/dashboard/AdViewModal';
import { Link } from 'react-router-dom';

type Ad = Tables<'ads'>;
type AdView = Tables<'ad_views'> & { ads: Pick<Ad, 'title'> };
type ActivePackage = (Tables<'user_packages'> & { packages: Pick<Tables<'packages'>, 'daily_ads_limit' | 'name'> | null });

const EarningsPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [watchedAds, setWatchedAds] = useState<AdView[]>([]);
  const [activePackage, setActivePackage] = useState<ActivePackage | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const dailyLimit = useMemo(() => activePackage?.packages?.daily_ads_limit ?? 0, [activePackage]);
  const adsViewedToday = useMemo(() => watchedAds.length, [watchedAds]);
  const canWatchMore = useMemo(() => dailyLimit > 0 && adsViewedToday < dailyLimit, [dailyLimit, adsViewedToday]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const [adsRes, watchedAdsRes, activePackageRes] = await Promise.all([
      supabase.from('ads').select('*'),
      supabase.from('ad_views').select('*, ads(title)').eq('user_id', user.id).gte('viewed_at', startOfToday),
      supabase.from('user_packages').select('*, packages(name, daily_ads_limit)').eq('user_id', user.id).lte('activated_at', now.toISOString()).gte('expires_at', now.toISOString()).single(),
    ]);

    if (adsRes.error) toast.error("Could not fetch ads.");
    else setAds(adsRes.data);

    if (watchedAdsRes.error) toast.error("Could not fetch viewing history.");
    else setWatchedAds(watchedAdsRes.data as AdView[]);

    // activePackageRes.error is expected if user has no active package, so we don't toast it
    if (activePackageRes.data) setActivePackage(activePackageRes.data as ActivePackage);
    else setActivePackage(null);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleWatchAd = (ad: Ad) => {
    if (!canWatchMore) {
      toast.error("You have reached your daily ad limit.");
      return;
    }
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const handleClaimReward = async (adId: string) => {
    setIsClaiming(true);
    try {
      const { data, error } = await supabase.functions.invoke('credit-ad-reward', {
        body: { ad_id: adId },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      toast.success(data.message || 'Reward claimed!');
      await refreshProfile();
      await fetchData(); // Refetch all data to update the page state
      setIsModalOpen(false);

    } catch (err: any) {
      toast.error(err.message || 'Failed to claim reward.');
    } finally {
      setIsClaiming(false);
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }
  
  if (!activePackage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-surface p-8 rounded-lg border border-border">
        <AlertTriangle className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-xl font-bold text-text-primary">No Active Package</h2>
        <p className="text-text-secondary mt-2 mb-6">You need to activate a package to start earning.</p>
        <Button as="a" to="/dashboard/packages" variant="primary">View Packages</Button>
      </div>
    );
  }

  return (
    <div>
      <AdViewModal 
        ad={selectedAd}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRewardClaim={handleClaimReward}
        isClaiming={isClaiming}
      />
      <h1 className="text-2xl font-bold text-text-primary mb-2">Watch & Earn</h1>
      <p className="text-text-secondary mb-6">Watch ads to earn rewards. You can watch up to {dailyLimit} ads per day with your <span className="font-semibold text-primary">{activePackage.packages?.name}</span> package.</p>
      
      <div className="bg-surface p-4 rounded-lg border border-border mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-text-secondary">Today's Progress</p>
          <p className="text-sm font-bold text-text-primary">{adsViewedToday} / {dailyLimit}</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(adsViewedToday / dailyLimit) * 100}%` }}></div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Available Ads</h2>
        {!canWatchMore && (
          <div className="bg-blue-900/50 text-blue-300 p-4 rounded-md mb-4 flex items-start">
            <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold">Daily Limit Reached</h4>
              <p className="text-sm">You have watched all your available ads for today. Please come back tomorrow to earn more.</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-surface p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <p className="font-semibold text-text-primary">{ad.title}</p>
                <p className="text-sm text-text-secondary">Reward: ${ad.reward_amount.toFixed(2)} | Duration: {ad.duration_seconds}s</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleWatchAd(ad)} disabled={!canWatchMore}>
                <Tv className="h-4 w-4 mr-2" />
                Watch
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Today's Earnings History</h2>
        <div className="bg-surface rounded-lg border border-border">
          {watchedAds.length > 0 ? (
            <ul className="divide-y divide-border">
              {watchedAds.map((view) => (
                <li key={view.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-text-primary">Watched "{view.ads.title}"</p>
                    <p className="text-sm text-text-secondary">
                      {new Date(view.viewed_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <p className="font-semibold text-primary">+${view.earned_amount.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary text-center p-8">You haven't watched any ads today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;

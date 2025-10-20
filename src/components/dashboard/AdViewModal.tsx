import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Gift } from 'lucide-react';
import { Tables } from '../../lib/database.types';
import Button from '../ui/Button';

type Ad = Tables<'ads'>;

interface AdViewModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onRewardClaim: (adId: string) => Promise<void>;
  isClaiming: boolean;
}

const AdViewModal: React.FC<AdViewModalProps> = ({ ad, isOpen, onClose, onRewardClaim, isClaiming }) => {
  const [timer, setTimer] = useState(0);
  const [isClaimable, setIsClaimable] = useState(false);

  useEffect(() => {
    if (isOpen && ad) {
      setTimer(ad.duration_seconds);
      setIsClaimable(false);
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsClaimable(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, ad]);

  const handleClaim = () => {
    if (ad) {
      onRewardClaim(ad.id);
    }
  };

  if (!ad) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface rounded-lg border border-border w-full max-w-lg shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text-primary">Watching Ad: {ad.title}</h3>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 text-center">
              <p className="text-text-secondary mb-4">Please wait for the timer to finish to claim your reward.</p>
              <div className="text-6xl font-bold text-primary my-6">
                {timer}s
              </div>
              <p className="text-text-secondary">You will earn <span className="font-bold text-primary">${ad.reward_amount.toFixed(2)}</span> for watching this ad.</p>
            </div>
            <div className="p-6 bg-background rounded-b-lg">
              <Button 
                variant="primary" 
                className="w-full flex justify-center items-center"
                disabled={!isClaimable || isClaiming}
                onClick={handleClaim}
              >
                {isClaiming ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Gift className="mr-2 h-5 w-5" />
                )}
                {isClaiming ? 'Claiming...' : 'Claim Reward'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdViewModal;

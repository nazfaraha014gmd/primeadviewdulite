import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const useCountUp = (value: number, duration = 1200) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let rafId: number;
    const start = performance.now();
    const loop = (t: number) => {
      const progress = Math.min(1, (t - start) / duration);
      setCurrent(Math.floor(progress * value));
      if (progress < 1) rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);

  return current;
};

const StatCard: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const earnings = useCountUp(inView ? 2450000 : 0, 1500);
  const users = useCountUp(inView ? 10000 : 0, 1200);
  const ads = useCountUp(inView ? 5000000 : 0, 1200);
  const growthRate = useCountUp(inView ? 25 : 0, 800);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${Math.floor(n / 1000000)}M+`;
    if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
    return `${n}+`;
  };

  return (
    <div ref={ref} className="w-full max-w-md md:ml-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="stats-card p-7 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-muted-foreground">Total Earnings Paid</div>
          <div className="px-2.5 py-1 bg-primary/15 rounded-md text-xs font-semibold text-primary flex items-center">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +{growthRate}% growth this month
          </div>
        </div>
        <div className="stats-value text-4xl font-bold mb-6">${formatNumber(earnings)}</div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-5 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="bg-white/8 rounded-lg p-3"
          >
            <div className="text-xs text-white/80">Active Users</div>
            <div className="mt-1 font-semibold text-white">{formatNumber(users)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="bg-white/8 rounded-lg p-3"
          >
            <div className="text-xs text-white/80">Ads Watched</div>
            <div className="mt-1 font-semibold text-white">{formatNumber(ads)}</div>
          </motion.div>
        </div>

        <div className="mt-4 text-sm text-emerald-300">+25% growth this month</div>
      </motion.div>
    </div>
  );
};

export default StatCard;

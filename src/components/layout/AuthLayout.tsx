import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Film } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-text-primary">PrimeAdView</span>
        </Link>
        <div className="bg-surface p-8 rounded-xl border border-border shadow-lg">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

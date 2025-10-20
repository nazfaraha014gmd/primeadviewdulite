import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { packages } from '../../lib/mockData';
import { Package } from '../../lib/types';
import Button from '../ui/Button';

const PackageCard: React.FC<{ pkg: Package; index: number }> = ({ pkg, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`bg-surface p-8 rounded-xl border ${pkg.isPopular ? 'border-primary' : 'border-border'} flex flex-col relative`}
    >
      {pkg.isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary px-3 py-1 text-sm font-semibold text-white rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-semibold text-text-primary mb-2">{pkg.name}</h3>
      <p className="text-text-secondary mb-6">Return on Investment: {pkg.roi}</p>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-bold text-text-primary">${pkg.price}</span>
        <span className="text-text-secondary ml-1">/ package</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-3" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant={pkg.isPopular ? 'primary' : 'outline'} className="w-full">
        Activate Package
      </Button>
    </motion.div>
  );
};

const PackagesSection: React.FC = () => {
  return (
    <section id="packages" className="py-20 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Choose Your Plan</h2>
          <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
            We have a plan for every need. Start small or go big.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.name} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;

import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Tv, CheckCircle } from 'lucide-react';

const stats = [
  { icon: <Users />, value: '15,000+', label: 'Active Members' },
  { icon: <DollarSign />, value: '$250K+', label: 'Total Paid Out' },
  { icon: <Tv />, value: '1.2M+', label: 'Ads Watched' },
  { icon: <CheckCircle />, value: '99.8%', label: 'User Satisfaction' },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="text-primary mb-2">{React.cloneElement(stat.icon, { size: 32 })}</div>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Package, PlayCircle, Wallet } from 'lucide-react';

const steps = [
  { icon: <UserPlus />, title: 'Create Account', description: 'Sign up for free in just a few minutes and get instant access.' },
  { icon: <Package />, title: 'Choose a Package', description: 'Select an earning package that fits your goals and budget.' },
  { icon: <PlayCircle />, title: 'Watch Ads', description: 'View short, engaging ads from our partners to earn rewards.' },
  { icon: <Wallet />, title: 'Withdraw Earnings', description: 'Easily withdraw your earnings through multiple payment methods.' },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">How It Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
            Getting started is as simple as these four steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-surface p-8 rounded-xl border border-border text-center"
            >
              <div className="flex justify-center items-center mb-4">
                <div className="bg-secondary p-4 rounded-full text-primary">
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

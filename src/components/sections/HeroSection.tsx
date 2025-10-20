import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import HeroStats from '../../components/HeroStats';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-muted/40 pt-20 pb-28">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 bg-primary/15 border border-primary/30 rounded-full mb-8 shadow-sm"
            >
              <span className="w-2.5 h-2.5 bg-primary rounded-full mr-2.5 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary">Join 10,000+ Earners</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] bg-clip-text"
            >
              Earn Money by <br /> Watching <span className="text-transparent bg-gradient-to-r from-primary to-primary/80">Advertisements</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              Start earning real money today with PrimeAdView. Simple signup, watch ads, and get paid instantly through multiple payment methods.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-5"
            >
              <Button 
                as="a" 
                to="/signup" 
                variant="primary" 
                className="rounded-lg px-8 py-3.5 shadow-lg shadow-primary/20 font-medium text-base hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              >
                Start Earning Now
              </Button>
              <Button 
                as="a" 
                to="#how-it-works" 
                variant="outline" 
                className="rounded-lg px-8 py-3.5 font-medium text-base hover:bg-muted/50 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-10 flex items-center space-x-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className={`w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-muted to-muted/80 shadow-md flex items-center justify-center text-xs font-medium`}
                  >
                    {i}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="font-bold text-foreground">4,000+</span> <span className="text-muted-foreground">people joined this week</span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-2xl blur-md opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-30 animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-xl shadow-2xl overflow-hidden">
                <HeroStats />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

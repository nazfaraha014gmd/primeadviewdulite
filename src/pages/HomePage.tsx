import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import PackagesSection from '../components/sections/PackagesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <PackagesSection />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;

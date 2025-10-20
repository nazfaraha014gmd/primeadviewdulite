import React from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../../lib/mockData';
import { Testimonial } from '../../lib/types';

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="bg-surface p-8 rounded-xl border border-border"
    >
      <p className="text-text-secondary mb-6 relative">
        <span className="text-5xl text-primary absolute -top-4 -left-4 opacity-20">“</span>
        {testimonial.text}
      </p>
      <div className="flex items-center">
        <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full mr-4" />
        <div>
          <p className="font-semibold text-text-primary">{testimonial.name}</p>
          <p className="text-sm text-text-secondary">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">What Our Users Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-text-secondary">
            Real stories from real users who are earning with PrimeAdView.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

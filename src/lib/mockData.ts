import { faker } from '@faker-js/faker';
import { Package, Testimonial } from './types';

export const packages: Package[] = [
  {
    name: 'Starter',
    price: 10,
    roi: '150%',
    features: ['5 Ads Daily', '0.1$ per Ad', '1 Month Validity', 'Basic Support'],
  },
  {
    name: 'Premium',
    price: 50,
    roi: '200%',
    features: ['15 Ads Daily', '0.15$ per Ad', '3 Months Validity', 'Priority Support'],
    isPopular: true,
  },
  {
    name: 'Business',
    price: 100,
    roi: '250%',
    features: ['Unlimited Ads', '0.2$ per Ad', '6 Months Validity', '24/7 Dedicated Support'],
  },
];

export const testimonials: Testimonial[] = Array.from({ length: 3 }, () => ({
  name: faker.person.fullName(),
  role: 'PrimeAdView User',
  avatar: faker.image.avatar(),
  text: faker.lorem.paragraph(),
}));

export interface Package {
  name: string;
  price: number;
  roi: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  text: string;
}


export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface SiteAssets {
  heroImage: string;
  aboutImage: string;
  servicesImage?: string;
  footerImage?: string;
}

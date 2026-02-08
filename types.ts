
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

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  url: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface CompanyDetails {
  name: string;
  ceo: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
  location: string;
  estd: number;
  logo?: string;
  aboutText?: string;
  socialLinks: SocialLink[];
  footerLinks: FooterLink[];
}

export type ShipmentStatus = 'dispatched' | 'in-transit' | 'near-destination' | 'delivered';

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: ShipmentStatus;
  lastUpdate: string;
  estimatedDelivery: string;
  description: string;
}

// Fixed missing Message export for GeminiAssistant
export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Fixed missing SiteAssets export for App and AdminPanel
export interface SiteAssets {
  heroImage: string;
  aboutImage: string;
}

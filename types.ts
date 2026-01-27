
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

export interface CompanyDetails {
  name: string;
  ceo: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
  location: string;
  estd: number;
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

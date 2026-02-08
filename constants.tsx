
import { Truck, Thermometer, Trash2, Box, Zap } from 'lucide-react';
import { Service, Stat } from './types.ts';

export const COMPANY_NAME = "Deluxe Roadways";
export const ESTD_YEAR = 2017;
export const LOCATION = "Faridabad, Haryana";
export const CEO = "Ram Bhagat";
export const GST_NO = "06BYTPB5931P1ZS";
export const FULL_ADDRESS = "Plot No. 15, Sector 24, Faridabad - 121005, Haryana, India";
export const CONTACT_PHONE = "+91 80489 67409";
export const CONTACT_EMAIL = "info@deluxeroadways.com";

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'mini-truck',
    title: 'Mini Truck Logistics Services',
    description: 'High-quality Mini Truck solutions for agile urban and inter-city distribution.',
    icon: 'truck',
    image: 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'refrigerated',
    title: 'Refrigerated Trucks Logistics Services',
    description: 'Specialized temperature-controlled transportation for sensitive pharmaceutical and perishable goods.',
    icon: 'thermometer',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'truck-transport',
    title: 'Heavy Truck Logistics',
    description: 'Heavy-duty industrial transportation solutions acknowledged for safety and reliability.',
    icon: 'truck',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: '1',
    name: "Amit Sharma",
    company: "Delhi Hardware Mart",
    role: "Logistics Head",
    quote: "Deluxe Roadways has been our trusted partner for years. Their mini-truck service is exceptionally punctual and professional.",
    rating: 5,
    approved: true
  },
  {
    id: '2',
    name: "Rajesh Khanna",
    company: "Faridabad Industrial Group",
    role: "Operations Manager",
    quote: "Highly reliable fleet and excellent support team. We've seen a 20% improvement in our delivery times since switching to Deluxe.",
    rating: 5,
    approved: true
  },
  {
    id: '3',
    name: "Priya Singh",
    company: "MediCare Pharma",
    role: "Supply Chain Lead",
    quote: "Their refrigerated truck services are the best in Haryana. Temp-sensitive deliveries are handled with absolute care.",
    rating: 5,
    approved: true
  },
  {
    id: '4',
    name: "Vikram Adityan",
    company: "Global Exports Ltd",
    role: "CEO",
    quote: "Professionalism at its peak. Deluxe Roadways is more than a transporter; they are a strategic logistics partner.",
    rating: 5,
    approved: true
  },
  {
    id: '5',
    name: "Suresh Gupta",
    company: "Gupta & Sons",
    role: "Proprietor",
    quote: "Reliable, budget-friendly, and honest. Ram Bhagat and his team ensure complete peace of mind for our cargo.",
    rating: 4,
    approved: true
  }
];

export const STATS: Stat[] = [
  { label: 'Operations Since', value: '2017', icon: 'calendar' },
  { label: 'Reliability Rate', value: '100%', icon: 'shield' },
  { label: 'Network Coverage', value: 'Pan-India', icon: 'map' },
  { label: 'Client Satisfaction', value: '5-Star', icon: 'star' }
];


import React from 'react';
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

export const SERVICES: Service[] = [
  {
    id: 'mini-truck',
    title: 'Mini Truck Logistics Services',
    description: 'High-quality Mini Truck solutions for agile urban and inter-city distribution.',
    icon: 'truck'
  },
  {
    id: 'refrigerated',
    title: 'Refrigerated Trucks Logistics Services',
    description: 'Specialized temperature-controlled transportation for sensitive pharmaceutical and perishable goods.',
    icon: 'thermometer'
  },
  {
    id: 'truck-transport',
    title: 'Truck Transportation Logistic Services',
    description: 'Heavy-duty industrial transportation solutions acknowledged for safety and reliability.',
    icon: 'truck-moving'
  },
  {
    id: 'garbage-truck',
    title: 'Garbage Truck Logistics Services',
    description: 'Professional disposal and waste management logistics for municipal and industrial sectors.',
    icon: 'trash-2'
  },
  {
    id: 'tata-shaktee',
    title: 'Tata Shaktee Logistics Service',
    description: 'Leveraging high-tonnage Tata Shaktee fleets for robust material movement across industrial hubs.',
    icon: 'zap'
  },
  {
    id: 'box-truck',
    title: 'Box Truck Logistics Services',
    description: 'Secure and enclosed transportation for high-value commercial cargo and retail goods.',
    icon: 'box'
  }
];

export const STATS: Stat[] = [
  { label: 'Operations Since', value: '2017', icon: 'calendar' },
  { label: 'Reliability Rate', value: '100%', icon: 'shield' },
  { label: 'Network Coverage', value: 'Pan-India', icon: 'map' },
  { label: 'Client Satisfaction', value: '5-Star', icon: 'star' }
];

export const SYSTEM_INSTRUCTION = `
You are the "Deluxe Roadways AI Assistant". 
Core Knowledge:
- Based in Faridabad, Haryana.
- Established 2017 as a Proprietor firm.
- Proprietor: Ram Bhagat.
- Services: Mini Truck Logistics Services, Refrigerated Trucks Logistics Services, Truck Transportation Logistic Services, Garbage Truck Logistics Services, Tata Shaktee Logistics Service, and Box Truck Logistics Services.
- Operations: We specialize in roadways/trucking across India.
- Pickup: Primarily from Haryana; Drop: Pan India.
- Tone: Professional, authoritative, and helpful.
- For all pricing/rate inquiries, direct the user to click the "Ask Price" button or fill out the inquiry form.
`;

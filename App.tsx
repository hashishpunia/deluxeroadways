
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Services from './components/Services.tsx';
import Stats from './components/Stats.tsx';
import Testimonials from './components/Testimonials.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';
import GeminiAssistant from './components/GeminiAssistant.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Tracking from './components/Tracking.tsx';
import { 
  SERVICES as INITIAL_SERVICES,
  COMPANY_NAME,
  ESTD_YEAR,
  LOCATION,
  CEO,
  GST_NO,
  FULL_ADDRESS,
  CONTACT_PHONE,
  CONTACT_EMAIL
} from './constants.tsx';
import { Service, Testimonial, SiteAssets, CompanyDetails, Shipment } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  
  // Dynamic Content States
  const [services, setServices] = useState<Service[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [assets, setAssets] = useState<SiteAssets>({
    heroImage: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca845?auto=format&fit=crop&q=80&w=2400',
    aboutImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'
  });

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: COMPANY_NAME,
    ceo: CEO,
    address: FULL_ADDRESS,
    phone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    gst: GST_NO,
    location: LOCATION,
    estd: ESTD_YEAR
  });

  useEffect(() => {
    // Load Company Details
    const storedDetails = localStorage.getItem('dr_company_details');
    if (storedDetails) setCompanyDetails(JSON.parse(storedDetails));

    // Load Services
    const storedServices = localStorage.getItem('dr_services');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      const mapped = INITIAL_SERVICES.map(s => ({
        ...s,
        image: s.image || 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&q=80&w=800'
      }));
      setServices(mapped);
      localStorage.setItem('dr_services', JSON.stringify(mapped));
    }

    // Load Shipments
    const storedShipments = localStorage.getItem('dr_shipments');
    if (storedShipments) {
      setShipments(JSON.parse(storedShipments));
    } else {
      const initial: Shipment[] = [
        {
          id: '1',
          trackingNumber: 'DR-2025-001',
          sender: 'Delhi Hardware Mart',
          receiver: 'Faridabad Hub',
          origin: 'Faridabad, HR',
          destination: 'Jaipur, RJ',
          currentLocation: 'Jaipur Sorting Facility',
          status: 'in-transit',
          lastUpdate: new Date().toLocaleString(),
          estimatedDelivery: 'Feb 28, 2025',
          description: 'Shipment has left the Faridabad hub and is currently at Jaipur Sorting Facility.'
        }
      ];
      setShipments(initial);
      localStorage.setItem('dr_shipments', JSON.stringify(initial));
    }

    // Load Testimonials
    const storedTestimonials = localStorage.getItem('dr_testimonials');
    if (storedTestimonials) {
      setTestimonials(JSON.parse(storedTestimonials));
    } else {
      const initial: Testimonial[] = [
        {
          id: '1',
          name: "Amit Sharma",
          company: "Delhi Hardware Mart",
          role: "Logistics Head",
          quote: "Deluxe Roadways has been our trusted partner for years. Their mini-truck service is exceptionally punctual.",
          rating: 5,
          approved: true
        }
      ];
      setTestimonials(initial);
      localStorage.setItem('dr_testimonials', JSON.stringify(initial));
    }

    // Load Assets
    const storedAssets = localStorage.getItem('dr_assets');
    if (storedAssets) setAssets(JSON.parse(storedAssets));

    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const updateAssets = (newAssets: SiteAssets) => {
    setAssets(newAssets);
    localStorage.setItem('dr_assets', JSON.stringify(newAssets));
  };

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('dr_services', JSON.stringify(newServices));
  };

  const updateShipments = (newShipments: Shipment[]) => {
    setShipments(newShipments);
    localStorage.setItem('dr_shipments', JSON.stringify(newShipments));
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    localStorage.setItem('dr_testimonials', JSON.stringify(newTestimonials));
  };

  const updateCompanyDetails = (newDetails: CompanyDetails) => {
    setCompanyDetails(newDetails);
    localStorage.setItem('dr_company_details', JSON.stringify(newDetails));
  };

  if (isAdmin) {
    return <AdminPanel 
      services={services}
      setServices={updateServices}
      testimonials={testimonials}
      setTestimonials={updateTestimonials}
      assets={assets}
      setAssets={updateAssets}
      companyDetails={companyDetails}
      setCompanyDetails={updateCompanyDetails}
      shipments={shipments}
      setShipments={updateShipments}
      onClose={() => {
        window.location.hash = '';
        setIsAdmin(false);
      }} 
    />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar details={companyDetails} />
      <main>
        <div className="relative">
          <Hero image={assets.heroImage} details={companyDetails} />
          <div className="max-w-7xl mx-auto px-6 -mt-24 sm:-mt-32 md:-mt-40 mb-20 relative z-50">
            <div className="text-center mb-6">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 inline-block shadow-lg">Fleet Operations Hub</span>
            </div>
            <Tracking shipments={shipments} />
          </div>
        </div>
        <About image={assets.aboutImage} details={companyDetails} />
        <Services services={services} />
        <Stats />
        <Testimonials testimonials={testimonials} setTestimonials={updateTestimonials} />
        <Contact details={companyDetails} />
      </main>
      <Footer details={companyDetails} />
      <GeminiAssistant details={companyDetails} />
    </div>
  );
};

export default App;

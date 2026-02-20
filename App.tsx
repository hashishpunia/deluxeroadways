
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
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  COMPANY_NAME,
  ESTD_YEAR,
  LOCATION,
  CEO,
  GST_NO,
  FULL_ADDRESS,
  CONTACT_PHONE,
  CONTACT_EMAIL
} from './constants.tsx';
import { Service, Testimonial, SiteAssets, CompanyDetails, Shipment, Inquiry } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([
    { id: '1', trackingNumber: 'DR-2025-001', sender: 'Delhi Hardware Mart', receiver: 'Faridabad Hub', origin: 'Faridabad, HR', destination: 'Jaipur, RJ', currentLocation: 'Jaipur Terminal', status: 'in-transit', lastUpdate: new Date().toLocaleString(), estimatedDelivery: '28 Feb, 2025', description: 'Consignment in transit between hubs.' }
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
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
    estd: ESTD_YEAR,
    aboutText: `Established as a Proprietor Firm in ${ESTD_YEAR}, ${COMPANY_NAME} has evolved into a premier name in the Indian logistics sector. Based in ${LOCATION}, we serve as the logistical backbone for major industrial players. Under the direct leadership of ${CEO}, our skilled experts ensure every shipment delivers precision results.`,
    socialLinks: [
      { platform: 'facebook', url: '#' },
      { platform: 'linkedin', url: '#' },
      { platform: 'instagram', url: '#' }
    ],
    footerLinks: [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Carrier Terms', url: '#' }
    ]
  });

  // Initial Data Fetch
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(serverData => {
        if (serverData) {
          if (serverData.services?.length > 0) setServices(serverData.services);
          if (serverData.inquiries?.length > 0) setInquiries(serverData.inquiries);
          if (serverData.shipments?.length > 0) setShipments(serverData.shipments);
          if (serverData.testimonials?.length > 0) setTestimonials(serverData.testimonials);
          if (serverData.assets) setAssets(serverData.assets);
          if (serverData.companyDetails) setCompanyDetails(serverData.companyDetails);
        }
        setDataLoaded(true);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setDataLoaded(true); // Proceed with defaults if server fails
      });
  }, []);

  // Sync to Server
  useEffect(() => {
    if (!dataLoaded) return;
    
    const syncData = async () => {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            services,
            inquiries,
            shipments,
            testimonials,
            assets,
            companyDetails
          })
        });
      } catch (err) {
        console.error('Failed to sync data:', err);
      }
    };

    const timeoutId = setTimeout(syncData, 1000); // Debounce sync
    return () => clearTimeout(timeoutId);
  }, [services, inquiries, shipments, testimonials, assets, companyDetails, dataLoaded]);

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-500 font-black tracking-widest animate-pulse uppercase text-xs">
          Synchronizing Systems...
        </div>
      </div>
    );
  }
  if (isAdmin) {
    return <AdminPanel 
      services={services}
      setServices={setServices}
      inquiries={inquiries}
      setInquiries={setInquiries}
      testimonials={testimonials}
      setTestimonials={setTestimonials}
      assets={assets}
      setAssets={setAssets}
      companyDetails={companyDetails}
      setCompanyDetails={setCompanyDetails}
      shipments={shipments}
      setShipments={setShipments}
      onClose={() => { window.location.hash = ''; setIsAdmin(false); }} 
    />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar details={companyDetails} />
      <main>
        <div className="relative">
          <Hero image={assets.heroImage} details={companyDetails} />
          <div className="max-w-7xl mx-auto px-6 -mt-24 sm:-mt-32 md:-mt-40 mb-20 relative z-50">
            <Tracking shipments={shipments} />
          </div>
        </div>
        <About image={assets.aboutImage} details={companyDetails} />
        <Services services={services} />
        <Stats />
        <Testimonials testimonials={testimonials} setTestimonials={setTestimonials} />
        <Contact details={companyDetails} inquiries={inquiries} setInquiries={setInquiries} />
      </main>
      <Footer details={companyDetails} />
      <GeminiAssistant details={companyDetails} />
    </div>
  );
};

export default App;

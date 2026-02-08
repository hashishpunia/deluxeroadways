
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
import { Service, Testimonial, SiteAssets, CompanyDetails, Shipment } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  
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

  useEffect(() => {
    // Company Details
    const storedDetails = localStorage.getItem('dr_company_details');
    if (storedDetails) setCompanyDetails(JSON.parse(storedDetails));

    // Services
    const storedServices = localStorage.getItem('dr_services');
    if (storedServices) setServices(JSON.parse(storedServices));
    else setServices(INITIAL_SERVICES);

    // Shipments
    const storedShipments = localStorage.getItem('dr_shipments');
    if (storedShipments) setShipments(JSON.parse(storedShipments));
    else {
      const initial: Shipment[] = [{ id: '1', trackingNumber: 'DR-2025-001', sender: 'Delhi Hardware Mart', receiver: 'Faridabad Hub', origin: 'Faridabad, HR', destination: 'Jaipur, RJ', currentLocation: 'Jaipur Terminal', status: 'in-transit', lastUpdate: new Date().toLocaleString(), estimatedDelivery: '28 Feb, 2025', description: 'Consignment in transit between hubs.' }];
      setShipments(initial);
      localStorage.setItem('dr_shipments', JSON.stringify(initial));
    }

    // Testimonials
    const storedTestimonials = localStorage.getItem('dr_testimonials');
    if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));
    else setTestimonials(INITIAL_TESTIMONIALS);

    // Assets
    const storedAssets = localStorage.getItem('dr_assets');
    if (storedAssets) setAssets(JSON.parse(storedAssets));

    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Persistence hooks
  useEffect(() => { localStorage.setItem('dr_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('dr_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('dr_shipments', JSON.stringify(shipments)); }, [shipments]);
  useEffect(() => { localStorage.setItem('dr_company_details', JSON.stringify(companyDetails)); }, [companyDetails]);
  useEffect(() => { localStorage.setItem('dr_assets', JSON.stringify(assets)); }, [assets]);

  if (isAdmin) {
    return <AdminPanel 
      services={services}
      setServices={setServices}
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
        <Contact details={companyDetails} />
      </main>
      <Footer details={companyDetails} />
      <GeminiAssistant details={companyDetails} />
    </div>
  );
};

export default App;


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
import { Service, Testimonial, SiteAssets, CompanyDetails } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  
  // Dynamic Content States
  const [services, setServices] = useState<Service[]>([]);
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
    if (storedDetails) {
      setCompanyDetails(JSON.parse(storedDetails));
    }

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
          quote: "Deluxe Roadways has been our trusted partner for 4 years now. Their mini-truck service in the NCR region is exceptionally punctual and cost-effective.",
          rating: 5,
          approved: true
        },
        {
          id: '2',
          name: "Priya Iyer",
          company: "Chennai Auto Parts",
          role: "Supply Chain Manager",
          quote: "We rely on Deluxe for our heavy-duty component transport from Faridabad to Chennai. Their tracking and safety standards are top-notch.",
          rating: 5,
          approved: true
        },
        {
          id: '3',
          name: "Vikram Singh",
          company: "Jaipur Stone Exports",
          role: "Operations Manager",
          quote: "Handling fragile stone shipments is difficult, but Deluxe Roadways manages our cargo with extreme care. Not a single breakage in 12 months.",
          rating: 5,
          approved: true
        },
        {
          id: '4',
          name: "Sunita Reddy",
          company: "Hyderabad Pharma Solutions",
          role: "Distribution Lead",
          quote: "Their refrigerated truck services are the best in the industry. Highly recommended for pharmaceutical movements where temperature control is critical.",
          rating: 5,
          approved: true
        },
        {
          id: '5',
          name: "Rahul Gupta",
          company: "Kolkata Retail Hub",
          role: "Founder",
          quote: "The team at Deluxe Roadways understands the urgency of retail distribution. Their Tata Shaktee fleet movement is remarkably fast.",
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
        <Hero image={assets.heroImage} details={companyDetails} />
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

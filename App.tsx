
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
import { SERVICES as INITIAL_SERVICES } from './constants.tsx';
import { Service, Testimonial, SiteAssets } from './types.ts';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  
  // Dynamic Content States
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [assets, setAssets] = useState<SiteAssets>({
    heroImage: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca845?auto=format&fit=crop&q=80&w=2400',
    aboutImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'
  });

  useEffect(() => {
    // Load Services
    const storedServices = localStorage.getItem('dr_services');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Map initial services to include images if they don't have them
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
      const initial = [
        {
          id: '1',
          name: "Rajesh Khanna",
          company: "Faridabad Steels Pvt. Ltd.",
          role: "Logistics Manager",
          quote: "Deluxe Roadways has been our primary carrier for ODC movements since 2018. Their professionalism and adherence to safety standards are unmatched.",
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

  if (isAdmin) {
    return <AdminPanel 
      services={services}
      setServices={updateServices}
      testimonials={testimonials}
      setTestimonials={updateTestimonials}
      assets={assets}
      setAssets={updateAssets}
      onClose={() => {
        window.location.hash = '';
        setIsAdmin(false);
      }} 
    />;
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero image={assets.heroImage} />
        <About image={assets.aboutImage} />
        <Services services={services} />
        <Stats />
        <Testimonials testimonials={testimonials} setTestimonials={updateTestimonials} />
        <Contact />
      </main>
      <Footer />
      <GeminiAssistant />
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { Menu, X, Truck } from 'lucide-react';
import { CompanyDetails } from '../types.ts';

interface NavbarProps {
  details: CompanyDetails;
}

const Navbar: React.FC<NavbarProps> = ({ details }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact Us', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <Truck size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">{details.name.toUpperCase().split(' ')[0]}<span className="text-amber-500">{details.name.toUpperCase().split(' ').slice(1).join('')}</span></span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-sm px-6"
          >
            Ask Price
          </button>
        </div>

        <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              onClick={(e) => handleNavClick(e, item.href)} 
              className="text-lg font-semibold py-2 text-slate-900"
            >
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="btn-primary text-center"
          >
            Ask Price
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

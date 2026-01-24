
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CompanyDetails } from '../types.ts';

interface HeroProps {
  image: string;
  details: CompanyDetails;
}

const Hero: React.FC<HeroProps> = ({ image, details }) => {
  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 overflow-hidden bg-white">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-transparent to-transparent -z-10"></div>
      
      <div className="max-w-5xl relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-xl shadow-slate-950/20">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          Established {details.estd} • {details.location}
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-950 mb-6 md:mb-8 leading-[1] md:leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {details.name.split(' ')[0]}<br className="hidden sm:block" />
          <span className="text-slate-300">{details.name.split(' ').slice(1).join(' ')}.</span>
        </h1>
        
        <p className="text-base md:text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 px-2">
          {details.location}'s prominent leading service provider. Delivering professional supply chain solutions across India with absolute precision.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <button 
            onClick={() => scrollTo('inquiry')}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 text-sm md:text-base shadow-2xl shadow-slate-950/20 cursor-pointer group"
          >
            Ask Price <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button 
            onClick={() => scrollTo('solutions')}
            className="px-8 md:px-10 py-4 md:py-5 rounded-full border-2 border-slate-100 text-sm md:text-base font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all w-full sm:w-auto cursor-pointer"
          >
            Explore Services
          </button>
        </div>
      </div>

      <div className="mt-12 md:mt-24 w-full max-w-7xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-[24px] sm:rounded-[48px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-1000 border-4 sm:border-8 border-white mx-auto relative group">
        <img 
          src={image} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
          alt="Premium Logistics Fleet"
        />
        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-all"></div>
      </div>
    </section>
  );
};

export default Hero;

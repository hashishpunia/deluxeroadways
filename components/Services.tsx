
import React from 'react';
import { Truck, Thermometer, Trash2, Box, Zap, ArrowRight, MapPin } from 'lucide-react';
import { Service } from '../types.ts';

interface ServicesProps {
  services: Service[];
}

const iconMap: Record<string, any> = {
  truck: Truck,
  thermometer: Thermometer,
  'trash-2': Trash2,
  box: Box,
  zap: Zap,
  'truck-moving': Truck
};

const Services: React.FC<ServicesProps> = ({ services }) => {
  const scrollToInquiry = (serviceName?: string) => {
    const elem = document.getElementById('inquiry');
    if (elem) {
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      if (serviceName) {
        const select = document.querySelector('select[name="service"]') as HTMLSelectElement;
        if (select) select.value = serviceName;
      }
    }
  };

  return (
    <section id="solutions" className="section-padding bg-white relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-16 md:mb-24">
        <div className="inline-block px-3 py-1 bg-amber-50 rounded-lg text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6">
          Our Capabilities
        </div>
        <h3 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-6 md:mb-8 leading-tight">
          Delivering Professional <br /><span className="text-slate-300">Logistics Excellence.</span>
        </h3>
        <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
          From our Faridabad hub to Pan-India destinations, we offer specialized fleet solutions managed by a skilled professional team.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        {services.map((s, i) => {
          const Icon = iconMap[s.icon] || Truck;
          return (
            <div key={s.id} className="group relative flex flex-col h-full rounded-[32px] md:rounded-[40px] overflow-hidden border border-slate-100 hover:border-slate-950 transition-all duration-500 hover:shadow-2xl">
              <div className="relative h-60 md:h-72 overflow-hidden bg-slate-100">
                {s.image ? (
                  <img 
                    src={s.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={s.title} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Icon size={48} />
                  </div>
                )}
                <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl text-slate-950 border border-slate-50">
                  <Icon size={20} />
                </div>
              </div>
              <div className="p-6 md:p-10 flex flex-col flex-1 bg-white">
                <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight leading-tight">{s.title}</h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mb-4 md:mb-6">
                  {s.description}
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => scrollToInquiry(s.title)}
                    className="w-full py-4 md:py-5 flex items-center justify-center gap-3 bg-slate-950 text-white rounded-2xl md:rounded-[20px] text-[11px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-amber-500 hover:text-slate-950 group/btn active:scale-95"
                  >
                    Ask Price <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-32">
        <div className="bg-slate-950 rounded-[32px] md:rounded-[64px] p-8 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-[0.05] md:opacity-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h3 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight">Ready for hassle-free execution?</h3>
            <p className="text-slate-400 text-base md:text-xl mb-8 md:mb-12 font-medium leading-relaxed">
              Experience the Deluxe standard in Indian logistics. Our experts ensure precision results within your budget.
            </p>
            <button 
              onClick={() => scrollToInquiry()}
              className="w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-amber-500 hover:bg-white text-slate-950 rounded-full font-black uppercase tracking-widest transition-all text-xs md:text-sm shadow-xl shadow-amber-500/20 active:scale-95"
            >
              Get Best Quote Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

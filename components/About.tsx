
import React from 'react';
import { ShieldCheck, Target, Award, Zap, Clock, TrendingUp } from 'lucide-react';
import { CompanyDetails } from '../types.ts';

interface AboutProps {
  image: string;
  details: CompanyDetails;
}

const About: React.FC<AboutProps> = ({ image, details }) => {
  const features = [
    { icon: Zap, title: "High Efficiency", text: "Optimized routes and smart scheduling for maximum output." },
    { icon: Clock, title: "Precision Timing", text: "Punctuality is the core pillar of our delivery promise." },
    { icon: TrendingUp, title: "Scalable Fleet", text: "Rapidly growing capacity to meet Pan-India demands." }
  ];

  return (
    <section id="about" className="section-padding bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          
          <div className="relative order-1 lg:order-1">
            <div className="aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden border-4 md:border-8 border-white shadow-2xl relative group">
              <img 
                src={image} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Logistics Heritage"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all"></div>
            </div>
            
            <div className="absolute -bottom-6 md:-bottom-10 -right-4 md:-right-6 bg-amber-500 p-6 md:p-10 rounded-3xl shadow-2xl animate-bounce-slow">
              <Award size={40} className="text-slate-950 mb-2" />
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-black text-slate-950">{new Date().getFullYear() - details.estd}+</div>
                <div className="text-[8px] md:text-[10px] font-black text-slate-900/60 uppercase tracking-widest">Years of Excellence</div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="flex items-center gap-3 text-amber-600 mb-6">
              <div className="h-[2px] w-8 md:w-12 bg-amber-600"></div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Legacy of Trust</span>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black leading-[1.1] mb-8 tracking-tighter text-slate-900">
              {details.location.split(',')[0]}'s Leading <br /><span className="text-slate-400">Roadway Hub.</span>
            </h3>
            
            <div className="space-y-6 text-base md:text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {details.aboutText || "Strategic logistics provider offering pan-India roadway solutions."}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <f.icon className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-1">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

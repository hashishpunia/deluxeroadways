
import React from 'react';
import { COMPANY_NAME, LOCATION, GST_NO, CONTACT_PHONE, CONTACT_EMAIL } from '../constants.tsx';
import { MapPin, Phone, Mail, Globe, ArrowRight, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    { Icon: Facebook, href: 'https://facebook.com/deluxeroadways', color: 'hover:text-blue-600' },
    { Icon: Twitter, href: 'https://twitter.com/deluxeroadways', color: 'hover:text-sky-400' },
    { Icon: Linkedin, href: 'https://linkedin.com/company/deluxeroadways', color: 'hover:text-blue-700' },
    { Icon: Instagram, href: 'https://instagram.com/deluxeroadways', color: 'hover:text-pink-600' }
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-32 pb-16 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          
          <div className="md:col-span-5">
            <h3 className="text-3xl font-black text-slate-950 mb-10 tracking-tighter">
              DELUXE<span className="text-amber-500">ROADWAYS</span>
            </h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
              Setting the infrastructure standard for Indian logistics movement since 2017. Reliable. Professional. Scalable.
            </p>
            <div className="flex gap-5">
               {socialLinks.map((social, idx) => (
                 <a 
                   key={idx} 
                   href={social.href} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${social.color} text-slate-400`}
                 >
                   <social.Icon size={20} strokeWidth={2.5} />
                 </a>
               ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
             <div>
               <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8">Navigation</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-400">
                 <li><a href="#home" className="hover:text-slate-950 transition-colors">Strategic Center</a></li>
                 <li><a href="#solutions" className="hover:text-slate-950 transition-colors">Capabilities</a></li>
                 <li><a href="#network" className="hover:text-slate-950 transition-colors">Our Network</a></li>
                 <li><a href="#about" className="hover:text-slate-950 transition-colors">Company Heritage</a></li>
               </ul>
             </div>

             <div>
               <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8">Core Assets</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-400">
                 <li><a href="#solutions" className="hover:text-slate-950 transition-colors">FTL Solutions</a></li>
                 <li><a href="#solutions" className="hover:text-slate-950 transition-colors">Industrial Bulk</a></li>
                 <li><a href="#solutions" className="hover:text-slate-950 transition-colors">Custom Logistics</a></li>
                 <li><a href="#solutions" className="hover:text-slate-950 transition-colors">Express Freight</a></li>
                 <li><a href="#about" className="hover:text-slate-950 transition-colors">Faridabad Ops</a></li>
               </ul>
             </div>

             <div className="col-span-2 md:col-span-1">
               <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8">Connect</h4>
               <div className="space-y-6">
                 <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-3 text-slate-400 text-sm font-bold group cursor-pointer hover:text-slate-950 transition-colors">
                   <Phone size={16} /> <span>{CONTACT_PHONE}</span>
                 </a>
                 <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-slate-400 text-sm font-bold group cursor-pointer hover:text-slate-950 transition-colors">
                   <Mail size={16} /> <span>Email Desk</span>
                 </a>
               </div>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
            © {new Date().getFullYear()} Deluxe Roadways. Verified GST No: {GST_NO}
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-slate-950 transition-colors">Legal Disclosures</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Privacy Portal</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Cookie Control</a>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 opacity-[0.03] text-[20vw] font-black tracking-tighter leading-none pointer-events-none select-none text-slate-950 uppercase">
        DELUXE
      </div>
    </footer>
  );
};

export default Footer;

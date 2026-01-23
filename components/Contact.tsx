
import React, { useState } from 'react';
import { GST_NO, FULL_ADDRESS, CONTACT_PHONE, CONTACT_EMAIL } from '../constants.tsx';
import { MapPin, Phone, Globe, Send, CheckCircle, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    
    const formData = new FormData(e.currentTarget);
    const newInquiry = {
      id: Date.now(),
      name: formData.get('name'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      notes: formData.get('notes'),
      date: new Date().toLocaleString(),
      status: 'new'
    };

    const existing = JSON.parse(localStorage.getItem('dr_inquiries') || '[]');
    localStorage.setItem('dr_inquiries', JSON.stringify([newInquiry, ...existing]));

    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-20">
        
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-6">Contact Us</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">
            Reliable Logistics <br />from Faridabad.
          </h3>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 border border-slate-100 mt-1 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Office Address</p>
                <p className="font-semibold text-slate-900">{FULL_ADDRESS}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 border border-slate-100 mt-1 shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Phone</p>
                <a href={`tel:${CONTACT_PHONE}`} className="font-semibold text-slate-900 hover:text-amber-600 transition-colors">{CONTACT_PHONE}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 border border-slate-100 mt-1 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Inquiry</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-slate-900 hover:text-amber-600 transition-colors">{CONTACT_EMAIL}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 border border-slate-100 mt-1 shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Business GST</p>
                <p className="font-semibold text-slate-900 uppercase">{GST_NO}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="inquiry" className="lg:col-span-3 bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
          {formState === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-20">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">Inquiry Received</h4>
              <p className="text-slate-500 max-w-sm">Thank you. Our team will review your requirements and get back to you with the best price shortly.</p>
              <button 
                onClick={() => setFormState('idle')}
                className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight text-center md:text-left uppercase">Ask Price</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Name</label>
                  <input name="name" required type="text" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium" placeholder="Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input name="phone" required type="tel" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium" placeholder="+91" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Logistics Service</label>
                  <select name="service" required className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium appearance-none bg-white">
                    <option value="">Choose a service...</option>
                    <option>Mini Truck Logistics Services</option>
                    <option>Refrigerated Trucks Logistics Services</option>
                    <option>Truck Transportation Logistic Services</option>
                    <option>Garbage Truck Logistics Services</option>
                    <option>Tata Shaktee Logistics Service</option>
                    <option>Box Truck Logistics Services</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Requirement Details</label>
                  <textarea name="notes" required rows={4} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium resize-none" placeholder="Volume, Route, etc."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button 
                    disabled={formState === 'submitting'}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-70"
                  >
                    {formState === 'submitting' ? 'Sending...' : (
                      <>Get Best Price <Send size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;

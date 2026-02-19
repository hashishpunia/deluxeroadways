
import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, X, Navigation, Locate, Phone, FileText, Printer } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types.ts';

interface TrackingProps {
  shipments: Shipment[];
}

const Tracking: React.FC<TrackingProps> = ({ shipments }) => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (result) {
      const updated = shipments.find(s => s.trackingNumber.toUpperCase() === result.trackingNumber.toUpperCase());
      if (updated) setResult(updated);
    }
  }, [shipments, result]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingId.trim().toUpperCase();
    if (!cleanId) return;

    const found = shipments.find(s => s.trackingNumber.toUpperCase() === cleanId);
    
    if (found) {
      setResult(found);
      setError(false);
    } else {
      setResult(null);
      setError(true);
      setTimeout(() => setError(false), 4000);
    }
  };

  const getStatusIndex = (status: ShipmentStatus) => {
    const steps: ShipmentStatus[] = ['dispatched', 'in-transit', 'near-destination', 'delivered'];
    return steps.indexOf(status);
  };

  const steps = [
    { id: 'dispatched', label: 'Dispatched', icon: Package },
    { id: 'in-transit', label: 'In Transit', icon: Truck },
    { id: 'near-destination', label: 'Hub Arrival', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 md:mt-12 relative z-20 px-4 md:px-0">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Track Consignment (e.g. DR-2025-001)"
            className="w-full bg-white border-4 border-slate-50 rounded-[32px] py-6 md:py-8 px-10 md:px-14 pr-20 md:pr-24 text-base md:text-xl font-black text-slate-950 shadow-[0_40px_100px_rgba(0,0,0,0.1)] focus:border-amber-500 focus:ring-8 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-300"
          />
          <button 
            type="submit"
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-5 md:p-6 rounded-[24px] hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-90 flex items-center justify-center shadow-xl"
            aria-label="Track Shipment"
          >
            <Search size={28} />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 text-center text-red-500 font-black text-sm animate-bounce tracking-widest uppercase">
          Consignment record not found. Please verify Tracking ID.
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8 overflow-y-auto">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-5xl md:rounded-[64px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col">
            
            {/* Industry Header */}
            <div className="p-10 md:p-14 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500 rounded-[32px] flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/30">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none mb-2">{result.trackingNumber}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Logistics Ops
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="p-4 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-all active:scale-90 border-2 border-slate-50"
              >
                <X size={40} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 md:p-16 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-16 md:mb-24">
                <div className="space-y-12">
                  <div className="relative pl-12 border-l-4 border-slate-100 space-y-16">
                    <div className="relative">
                      <div className="absolute -left-[54px] top-0 w-8 h-8 bg-white border-8 border-slate-100 rounded-full"></div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Freight Origin</div>
                      <div className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">{result.origin}</div>
                    </div>
                    <div className="relative p-8 md:p-10 bg-amber-50 rounded-[40px] border-4 border-amber-100 shadow-xl shadow-amber-500/10">
                      <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.6)]"></div>
                      <div className="flex items-center gap-4 mb-3">
                        <Locate size={20} className="text-amber-600 animate-pulse" />
                        <div className="text-[11px] font-black text-amber-600 uppercase tracking-[0.4em]">Active Sector</div>
                      </div>
                      <div className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter">{result.currentLocation}</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[54px] top-0 w-8 h-8 bg-slate-950 rounded-full border-8 border-white shadow-xl"></div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Final Terminal</div>
                      <div className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">{result.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-12 md:p-16 rounded-[56px] text-white flex flex-col justify-between shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
                  </div>
                  <div className="space-y-10 relative z-10">
                    <div>
                      <div className="text-[11px] font-black text-amber-500 uppercase tracking-[0.5em] mb-6">Operational Log Entry</div>
                      <p className="text-xl md:text-3xl font-bold leading-relaxed italic opacity-95 tracking-tight">"{result.description}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 md:gap-10 pt-10 border-t border-white/10">
                      <div>
                        <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">ETA Projection</div>
                        <div className="text-2xl md:text-3xl font-black text-amber-500 tracking-tighter">{result.estimatedDelivery}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Last Sync</div>
                        <div className="text-2xl md:text-3xl font-black text-white tracking-tighter">{result.lastUpdate.split(',')[0]}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4 text-white/40">
                      <Clock size={24} />
                      <span className="text-[11px] font-black uppercase tracking-[0.5em]">Sync Status: Verified</span>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center border border-white/5 group-hover:bg-amber-500 transition-all group-hover:text-slate-950">
                      <Truck size={32} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative pb-16 px-6">
                <div className="absolute top-[40px] md:top-[50px] left-[60px] md:left-[80px] right-[60px] md:right-[80px] h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1500 ease-out shadow-[0_0_40px_rgba(245,158,11,0.6)]"
                    style={{ width: `${(getStatusIndex(result.status) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                    const isActive = getStatusIndex(result.status) >= idx;
                    const isCurrent = getStatusIndex(result.status) === idx;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-8 border-white shadow-2xl flex items-center justify-center transition-all duration-700 relative z-10 ${isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-100 text-slate-300'} ${isCurrent ? 'ring-[20px] ring-amber-500/10' : ''}`}>
                          <Icon size={isActive ? 36 : 28} className={isCurrent ? 'animate-pulse' : ''} />
                        </div>
                        <span className={`mt-8 text-[12px] md:text-sm font-black uppercase tracking-[0.4em] text-center transition-colors ${isActive ? 'text-slate-950' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 mt-auto shrink-0 border-t border-slate-100">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center border-4 border-slate-100 text-slate-400 shadow-xl">
                  <Phone size={28} />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Fleet Support Desk</div>
                  <div className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter">+91 80489 67409</div>
                </div>
              </div>
              
              <div className="flex flex-row items-center gap-6 w-full md:w-auto">
                 <button className="flex-1 md:flex-none px-12 py-6 bg-white border-4 border-slate-200 text-slate-950 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] hover:border-slate-950 transition-all flex items-center justify-center gap-4 group">
                    <Printer size={20} className="group-hover:text-amber-500" /> Print Manifest
                 </button>
                 <button className="flex-1 md:flex-none px-12 py-6 bg-slate-950 text-white rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group">
                    <FileText size={20} className="text-amber-500" /> Proof of Delivery
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

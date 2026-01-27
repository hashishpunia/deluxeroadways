
import React, { useState, useEffect } from 'react';
/* Added Phone to the lucide-react imports to fix the "Cannot find name 'Phone'" error */
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, X, Navigation, Locate, Phone } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types.ts';

interface TrackingProps {
  shipments: Shipment[];
}

const Tracking: React.FC<TrackingProps> = ({ shipments }) => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  // Sync results if shipments update (real-time responsiveness)
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
    { id: 'near-destination', label: 'Near Hub', icon: MapPin },
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
            placeholder="Search Tracking ID (DR-2025-XXX)"
            className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl py-4 md:py-6 px-6 md:px-10 pr-16 md:pr-20 text-sm md:text-lg font-bold text-slate-900 shadow-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-300"
          />
          <button 
            type="submit"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-90 flex items-center justify-center shadow-lg"
            aria-label="Track Shipment"
          >
            <Search size={20} md:size={24} />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-center text-red-500 font-bold text-xs md:text-sm animate-bounce">
          Consignment not found. Please verify the Tracking ID.
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">{result.trackingNumber}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Tracking
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12">
              {/* Desktop/Tablet Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16">
                <div className="space-y-6 md:space-y-8">
                  <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 bg-white border-4 border-slate-200 rounded-full"></div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</div>
                      <div className="text-lg md:text-xl font-bold text-slate-900">{result.origin}</div>
                    </div>
                    <div className="relative p-5 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm animate-pulse-slow">
                      <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-500 rounded-full shadow-lg shadow-amber-500/40"></div>
                      <div className="flex items-center gap-3 mb-1">
                        <Locate size={14} className="text-amber-600" />
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Current Status</div>
                      </div>
                      <div className="text-lg md:text-xl font-black text-slate-900">{result.currentLocation}</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 bg-slate-950 rounded-full border-4 border-white shadow-lg"></div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Destination</div>
                      <div className="text-lg md:text-xl font-bold text-slate-900">{result.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Status</div>
                      <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed italic">"{result.description}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Est.</div>
                        <div className="text-sm md:text-base font-bold text-slate-900">{result.estimatedDelivery}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</div>
                        <div className="text-sm md:text-base font-bold text-slate-900">{result.lastUpdate.split(',')[0]}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Clock size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Tracking History Updated Just Now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative pb-10">
                <div className="absolute top-[22px] md:top-[28px] left-[20px] md:left-[40px] right-[20px] md:right-[40px] h-1 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    style={{ width: `${(getStatusIndex(result.status) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="relative flex justify-between px-0 md:px-5">
                  {steps.map((step, idx) => {
                    const isActive = getStatusIndex(result.status) >= idx;
                    const isCurrent = getStatusIndex(result.status) === idx;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-700 relative z-10 ${isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-100 text-slate-300'} ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}>
                          <Icon size={isActive ? 20 : 18} md:size={isActive ? 24 : 20} className={isCurrent ? 'animate-pulse' : ''} />
                        </div>
                        <span className={`mt-3 md:mt-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center transition-colors px-1 ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
              <div className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Secure Transit Protected by Deluxe</div>
              <div className="flex gap-4">
                <button className="text-white/60 hover:text-amber-500 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                  <Phone size={12} /> Support Helpdesk
                </button>
                <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
                <button className="text-white/60 hover:text-amber-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Inquiry #890</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

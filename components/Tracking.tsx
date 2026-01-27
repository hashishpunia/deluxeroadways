
import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, X, Navigation } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types.ts';

interface TrackingProps {
  shipments: Shipment[];
}

const Tracking: React.FC<TrackingProps> = ({ shipments }) => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  // Sync results if shipments update (useful for real-time admin changes)
  useEffect(() => {
    if (result) {
      const updated = shipments.find(s => s.trackingNumber === result.trackingNumber);
      if (updated) setResult(updated);
    }
  }, [shipments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingId.trim().toUpperCase();
    const found = shipments.find(s => s.trackingNumber.toUpperCase() === cleanId);
    
    if (found) {
      setResult(found);
      setError(false);
    } else {
      setResult(null);
      setError(true);
      // Auto clear error after 3s
      setTimeout(() => setError(false), 3000);
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
    <div className="w-full max-w-2xl mx-auto mt-8 md:mt-12 relative z-20 px-2 md:px-0">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID (DR-2025-XXX)"
          className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl py-4 md:py-5 px-6 md:px-8 pr-14 md:pr-16 text-base md:text-lg font-bold text-slate-900 shadow-2xl focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
        />
        <button 
          type="submit"
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-2.5 md:p-3.5 rounded-xl md:rounded-2xl hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-95"
        >
          <Search size={20} />
        </button>
      </form>

      {error && (
        <div className="mt-4 text-center text-red-500 font-bold text-xs md:text-sm animate-in fade-in slide-in-from-top-2">
          Consignment not found. Please check the ID and try again.
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] md:rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 my-auto">
            <button 
              onClick={() => setResult(null)}
              className="absolute top-4 right-4 md:top-6 md:right-8 p-2 text-slate-400 hover:text-slate-950 bg-slate-50 rounded-full transition-colors z-10"
            >
              <X size={20} md:size={24} />
            </button>

            <div className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 border-b border-slate-100 pb-6 md:pb-8">
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Live Tracking</div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-950">{result.trackingNumber}</h3>
                </div>
                <div className="bg-slate-50 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 flex md:block items-center justify-between gap-4">
                  <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</div>
                  <div className="font-bold text-slate-900 text-sm md:text-base">{result.estimatedDelivery}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-amber-600" size={18} />
                    </div>
                    <div>
                      <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</div>
                      <div className="font-bold text-slate-900 text-sm md:text-base">{result.origin}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-white" size={18} />
                    </div>
                    <div>
                      <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</div>
                      <div className="font-bold text-slate-900 text-sm md:text-base">{result.destination}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 md:p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
                      <Navigation className="text-white" size={18} />
                    </div>
                    <div>
                      <div className="text-[8px] md:text-[10px] font-black text-amber-600 uppercase tracking-widest">Current Location</div>
                      <div className="font-bold text-slate-900 text-sm md:text-base">{result.currentLocation || "In Transit"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-100">
                  <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latest Update</div>
                  <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed mb-4">{result.description}</p>
                  <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-medium text-slate-400">
                    <Clock size={12} />
                    {result.lastUpdate}
                  </div>
                </div>
              </div>

              {/* Progress Stepper - Optimized for Mobile */}
              <div className="relative pt-6 md:pt-8 px-2 md:px-4">
                <div className="absolute top-[34px] md:top-[42px] left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                    style={{ width: `${(getStatusIndex(result.status) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                
                <div className="relative flex justify-between">
                  {steps.map((step, idx) => {
                    const isActive = getStatusIndex(result.status) >= idx;
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative z-10 ${isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-100 text-slate-300'}`}>
                          <Icon size={16} md:size={20} />
                        </div>
                        <span className={`mt-3 md:mt-4 text-[7px] md:text-[10px] font-black uppercase tracking-widest text-center transition-colors ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 md:p-6 text-center border-t border-slate-100">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Logistics by Deluxe Roadways</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

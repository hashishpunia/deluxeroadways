
import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, X, Navigation, Locate, Phone, FileText, Download } from 'lucide-react';
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
    { id: 'near-destination', label: 'Near Hub', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 md:mt-12 relative z-20 px-4 md:px-0">
      <form onSubmit={handleSearch} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Consignment Number (e.g. DR-2025-001)"
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
        <div className="mt-4 text-center text-red-500 font-bold text-xs md:text-sm animate-in fade-in slide-in-from-top-2">
          Tracking ID not valid. Please check and try again.
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 lg:p-10">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-4xl md:rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col">
            
            {/* Modal Header - Professional Sticky Header */}
            <header className="p-5 md:p-8 lg:p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-30 shrink-0">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
                  <Package size={24} md:size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.2em] bg-amber-50 px-2 py-0.5 rounded-md">Live Status</span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">ID: {result.trackingNumber}</span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-950 tracking-tight leading-none">Consignment Details</h3>
                </div>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-all active:scale-90 flex items-center justify-center border border-slate-50"
              >
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 md:p-10 lg:p-12">
                
                {/* Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-10 md:mb-16">
                  <div className="space-y-6 md:space-y-8">
                    {/* Location Info */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-[32px] border border-slate-100 relative group overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <Navigation size={16} className="text-amber-500" />
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Live GPS Position</span>
                        </div>
                        <div className="text-2xl md:text-4xl font-black text-slate-900 mb-2">{result.currentLocation}</div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Clock size={14} />
                          Last Update: {result.lastUpdate}
                        </div>
                      </div>
                      <Locate className="absolute -right-8 -bottom-8 text-slate-200 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                    </div>

                    {/* Route Details */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin City</div>
                        <div className="text-sm md:text-lg font-bold text-slate-900">{result.origin.split(',')[0]}</div>
                      </div>
                      <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Destination</div>
                        <div className="text-sm md:text-lg font-bold text-slate-900">{result.destination.split(',')[0]}</div>
                      </div>
                    </div>
                  </div>

                  {/* Operation Log */}
                  <div className="bg-slate-900 p-8 md:p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                    <div>
                      <div className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-6">Operations Desk Log</div>
                      <p className="text-base md:text-xl font-medium leading-relaxed italic opacity-90">
                        "{result.description}"
                      </p>
                    </div>
                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
                      <div>
                        <div className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Estimated Arrival</div>
                        <div className="text-lg md:text-xl font-black text-amber-500">{result.estimatedDelivery}</div>
                      </div>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-amber-500 transition-all group-hover:text-slate-950">
                        <Truck size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="mb-8 px-2 md:px-6">
                  <div className="relative pt-6">
                    {/* Horizontal Line for Desktop */}
                    <div className="absolute top-[40px] md:top-[56px] left-[50px] right-[50px] h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                        style={{ width: `${(getStatusIndex(result.status) / (steps.length - 1)) * 100}%` }}
                      />
                    </div>
                    
                    <div className="relative flex flex-col sm:flex-row justify-between gap-10 sm:gap-2">
                      {steps.map((step, idx) => {
                        const isActive = getStatusIndex(result.status) >= idx;
                        const isCurrent = getStatusIndex(result.status) === idx;
                        const Icon = step.icon;
                        return (
                          <div key={step.id} className="flex flex-row sm:flex-col items-center flex-1 gap-5 sm:gap-0">
                            {/* Icon Container */}
                            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-all duration-700 relative z-10 shrink-0 ${isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-100 text-slate-300'} ${isCurrent ? 'ring-8 ring-amber-500/10' : ''}`}>
                              <Icon size={isActive ? 24 : 22} md:size={32} className={isCurrent ? 'animate-pulse' : ''} />
                            </div>
                            {/* Label */}
                            <div className="flex flex-col sm:items-center">
                              <span className={`sm:mt-5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                                {step.label}
                              </span>
                              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 sm:hidden uppercase tracking-widest mt-1">
                                {isActive ? (isCurrent ? 'Current' : 'Completed') : 'Pending'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer - Professional Buttons Sticky at Bottom */}
            <footer className="bg-slate-50 p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center border border-slate-200 text-slate-400 shadow-sm">
                  <Phone size={18} md:size={24} />
                </div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assistance Line</div>
                  <div className="text-sm md:text-lg font-black text-slate-900">+91 80489 67409</div>
                </div>
              </div>
              
              <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 md:px-8 py-4 bg-white border-2 border-slate-200 text-slate-950 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                  <FileText size={16} /> Print Receipt
                </button>
                <button className="flex-1 md:flex-none px-6 md:px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2">
                  <Download size={16} className="text-amber-500" /> Download POD
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

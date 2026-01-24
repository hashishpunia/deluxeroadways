
import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, X } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types.ts';

interface TrackingProps {
  shipments: Shipment[];
}

const Tracking: React.FC<TrackingProps> = ({ shipments }) => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = shipments.find(s => s.trackingNumber.toUpperCase() === trackingId.toUpperCase());
    if (found) {
      setResult(found);
      setError(false);
    } else {
      setResult(null);
      setError(true);
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
    <div className="w-full max-w-2xl mx-auto mt-12 relative z-20">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID (e.g. DR-2024-001)"
          className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 px-8 pr-16 text-lg font-bold text-slate-900 shadow-2xl focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950 text-white p-3.5 rounded-2xl hover:bg-amber-500 hover:text-slate-950 transition-all active:scale-95"
        >
          <Search size={24} />
        </button>
      </form>

      {error && (
        <div className="mt-4 text-center text-red-500 font-bold text-sm animate-in fade-in slide-in-from-top-2">
          Consignment not found. Please verify your Tracking ID.
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setResult(null)}
              className="absolute top-6 right-8 p-2 text-slate-400 hover:text-slate-950 bg-slate-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
                <div>
                  <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Live Consignment Tracking</div>
                  <h3 className="text-3xl font-black text-slate-950">{result.trackingNumber}</h3>
                </div>
                <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</div>
                  <div className="font-bold text-slate-900">{result.estimatedDelivery}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</div>
                      <div className="font-bold text-slate-900">{result.origin}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</div>
                      <div className="font-bold text-slate-900">{result.destination}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Latest Status Update</div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">{result.description}</p>
                  <div className="text-[10px] font-medium text-slate-400">{result.lastUpdate}</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative pt-8 px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
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
                        <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 relative z-10 ${isActive ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-100 text-slate-300'}`}>
                          <Icon size={20} />
                        </div>
                        <span className={`mt-4 text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400">Need help? Call our 24/7 hotline at +91 80489 67409</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;

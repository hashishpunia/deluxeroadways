
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Inbox, LogOut, Trash2, CheckCircle2, Clock, 
  Truck, Users, Plus, Edit, Image as ImageIcon, X, Save, 
  Upload, Settings, MapPin, Package, Navigation, ArrowRight, 
  SaveIcon, AlertCircle, RefreshCw
} from 'lucide-react';
import { Service, Testimonial, SiteAssets, CompanyDetails, Shipment, ShipmentStatus } from '../types.ts';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  service: string;
  notes: string;
  date: string;
  status: 'new' | 'viewed' | 'resolved';
}

interface AdminPanelProps {
  onClose: () => void;
  services: Service[];
  setServices: (s: Service[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
  assets: SiteAssets;
  setAssets: (a: SiteAssets) => void;
  companyDetails: CompanyDetails;
  setCompanyDetails: (c: CompanyDetails) => void;
  shipments: Shipment[];
  setShipments: (s: Shipment[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, 
  services, 
  setServices, 
  testimonials, 
  setTestimonials, 
  assets, 
  setAssets,
  companyDetails,
  setCompanyDetails,
  shipments,
  setShipments
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'services' | 'testimonials' | 'assets' | 'settings' | 'shipments'>('dashboard');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dr_inquiries') || '[]');
    setInquiries(data);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'deluxe2017') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin credentials');
    }
  };

  const generateYearlyTrackingId = () => {
    const year = new Date().getFullYear();
    const currentYearShipments = shipments.filter(s => s.trackingNumber.startsWith(`DR-${year}-`));
    
    let nextNum = 1;
    if (currentYearShipments.length > 0) {
      const numbers = currentYearShipments.map(s => {
        const parts = s.trackingNumber.split('-');
        return parseInt(parts[parts.length - 1]) || 0;
      });
      nextNum = Math.max(...numbers) + 1;
    }

    return `DR-${year}-${nextNum.toString().padStart(3, '0')}`;
  };

  const handleSaveShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;
    
    const isNew = !shipments.find(s => s.id === editingShipment.id);
    let updatedShipments: Shipment[];

    if (!isNew) {
      updatedShipments = shipments.map(s => s.id === editingShipment.id ? { ...editingShipment, lastUpdate: new Date().toLocaleString() } : s);
    } else {
      updatedShipments = [...shipments, { ...editingShipment, lastUpdate: new Date().toLocaleString() }];
    }
    
    setShipments(updatedShipments);
    localStorage.setItem('dr_shipments', JSON.stringify(updatedShipments));
    setEditingShipment(null);
  };

  const deleteShipment = (id: string) => {
    if (!confirm('Delete this shipment record permanently?')) return;
    const updated = shipments.filter(s => s.id !== id);
    setShipments(updated);
    localStorage.setItem('dr_shipments', JSON.stringify(updated));
  };

  const handleCompanyDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyDetails({
      ...companyDetails,
      [name]: name === 'estd' ? parseInt(value) || 2017 : value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-2xl border border-white/10">
              <Settings size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Gateway</h1>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Faridabad Headquarters</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Passkey Credentials</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono text-center tracking-[0.5em] bg-slate-50 text-xl font-bold"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-950/20 text-sm">
              Authenticate Entry
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-950 transition-colors py-4">Return to Public Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0 sticky top-0 h-screen z-50 shadow-sm">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500 shadow-lg">
              <Package size={20} />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-slate-950 leading-none">Deluxe<br/><span className="text-amber-500">Logistics</span></span>
          </div>
          
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
              { id: 'inquiries', icon: Inbox, label: 'Lead Desk', count: inquiries.filter(i => i.status === 'new').length },
              { id: 'shipments', icon: MapPin, label: 'Consignment Hub' },
              { id: 'services', icon: Truck, label: 'Fleet Configuration' },
              { id: 'testimonials', icon: Users, label: 'Client Feedback' },
              { id: 'assets', icon: ImageIcon, label: 'Media Assets' },
              { id: 'settings', icon: Settings, label: 'Agency Profile' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${activeTab === item.id ? 'bg-slate-950 text-white shadow-2xl shadow-slate-950/30' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={activeTab === item.id ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-950'} />
                  <span>{item.label}</span>
                </div>
                {item.count ? <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black">{item.count}</span> : null}
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-8 border-t border-slate-100">
            <button onClick={onClose} className="w-full flex items-center gap-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors group">
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-5 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <Package size={24} className="text-amber-500" />
          <span className="text-sm font-black tracking-tight uppercase">Admin Console</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 bg-slate-50 p-2.5 rounded-xl"><LogOut size={20} /></button>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-4 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'inquiries', icon: Inbox },
          { id: 'shipments', icon: MapPin },
          { id: 'settings', icon: Settings }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)}
            className={`p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-slate-950 text-white scale-110 shadow-xl' : 'text-slate-400'}`}
          >
            <item.icon size={22} />
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 md:p-10 lg:p-14 pb-32 lg:pb-14">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-10 bg-amber-500"></span>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Operations Management</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter capitalize leading-none">{activeTab.replace('-', ' ')}</h2>
          </div>
          {activeTab === 'shipments' && (
             <button 
             onClick={() => setEditingShipment({ 
               id: Date.now().toString(), 
               trackingNumber: generateYearlyTrackingId(), 
               sender: '', 
               receiver: '', 
               origin: 'Faridabad, HR', 
               destination: '', 
               currentLocation: 'Faridabad Hub',
               status: 'dispatched', 
               lastUpdate: new Date().toLocaleString(),
               estimatedDelivery: '3-5 Working Days',
               description: 'New consignment registered. Final checks in progress.'
             })}
             className="w-full md:w-auto bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 text-xs shadow-2xl shadow-slate-950/20"
           >
             <Plus size={22} className="text-amber-500" /> Book New Shipment
           </button>
          )}
        </header>

        {/* SHIPMENTS TAB */}
        {activeTab === 'shipments' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Table View */}
            <div className="hidden md:block bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">ID / Consignee</th>
                      <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">GPS Position</th>
                      <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                      <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Phase</th>
                      <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shipments.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-7">
                          <div className="font-black text-slate-950 text-lg tracking-tight">{s.trackingNumber}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">To: {s.receiver}</div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="text-sm font-black text-slate-700 flex items-center gap-2.5">
                            <Navigation size={16} className="text-amber-500" />
                            {s.currentLocation}
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="text-sm font-bold text-slate-700 flex items-center gap-3">
                            <span className="bg-slate-100 px-2 py-1 rounded text-[10px] uppercase">{s.origin.split(',')[0]}</span>
                            <ArrowRight size={14} className="text-amber-500" /> 
                            <span className="bg-amber-50 px-2 py-1 rounded text-[10px] uppercase text-amber-600">{s.destination.split(',')[0] || '?'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                            s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                          }`}>{s.status}</span>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <div className="flex justify-end gap-3 group-hover:opacity-100 opacity-60 transition-opacity">
                            <button onClick={() => setEditingShipment(s)} className="p-3 text-slate-900 hover:bg-slate-100 rounded-xl transition-all"><Edit size={20} /></button>
                            <button onClick={() => deleteShipment(s.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-6">
              {shipments.map((s) => (
                <div key={s.id} className="bg-white p-7 rounded-[32px] border-2 border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-black text-slate-950 tracking-tighter leading-none">{s.trackingNumber}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Con: {s.receiver}</div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                    }`}>{s.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-black text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <Navigation size={22} className="text-amber-500" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Logged Hub</span>
                      {s.currentLocation}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest">
                      {s.origin.split(',')[0]} <ArrowRight size={16} className="text-amber-500" /> {s.destination.split(',')[0] || '?'}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingShipment(s)} className="p-3.5 bg-slate-950 text-white rounded-xl shadow-lg active:scale-90"><Edit size={18} /></button>
                      <button onClick={() => deleteShipment(s.id)} className="p-3.5 bg-red-50 text-red-500 rounded-xl border border-red-100 active:scale-90"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipment Editor Modal - FULLY OPTIMIZED FOR ALL DEVICES */}
            {editingShipment && (
              <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[500] flex items-center justify-center p-0 md:p-6 lg:p-12 overflow-hidden">
                <div className="bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-5xl md:rounded-[48px] shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 duration-500">
                   
                   {/* Modal Header - Sticky */}
                   <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 shrink-0">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-950 rounded-2xl md:rounded-3xl flex items-center justify-center text-amber-500 shadow-2xl">
                          <Package size={24} md:size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none mb-1">Consignment Registry</h3>
                          <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Update Database Log: {editingShipment.trackingNumber}</p>
                        </div>
                     </div>
                     <button onClick={() => setEditingShipment(null)} className="p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-100"><X size={32} /></button>
                   </div>
                   
                   {/* Modal Body - Scrollable */}
                   <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                     <div className="p-6 md:p-12">
                       <form id="shipment-form" onSubmit={handleSaveShipment} className="space-y-12 md:space-y-16">
                         
                         {/* Core Identity Section */}
                         <div className="space-y-8">
                           <div className="flex items-center gap-4">
                             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                             <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.4em]">Essential Data</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tracking ID (Secure Generation)</label>
                               <div className="relative group">
                                 <input required value={editingShipment.trackingNumber} onChange={e => setEditingShipment({...editingShipment, trackingNumber: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-mono font-black text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm group-hover:border-slate-200" />
                                 <RefreshCw size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-amber-500 cursor-pointer transition-colors" title="Regenerate ID" onClick={() => setEditingShipment({...editingShipment, trackingNumber: generateYearlyTrackingId()})} />
                               </div>
                             </div>
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current Operating Phase</label>
                               <select value={editingShipment.status} onChange={e => setEditingShipment({...editingShipment, status: e.target.value as ShipmentStatus})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-slate-950 uppercase tracking-[0.2em] text-[11px] focus:border-amber-500 focus:bg-white transition-all cursor-pointer">
                                  <option value="dispatched">Logistics: Dispatched</option>
                                  <option value="in-transit">Logistics: In Transit</option>
                                  <option value="near-destination">Logistics: Near Hub</option>
                                  <option value="delivered">Logistics: Delivered</option>
                               </select>
                             </div>
                           </div>
                         </div>

                         {/* Real-time Tracking Section */}
                         <div className="space-y-8">
                           <div className="flex items-center gap-4">
                             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                             <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.4em]">Live Tracking Parameters</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Logged GPS City</label>
                               <input required value={editingShipment.currentLocation} onChange={e => setEditingShipment({...editingShipment, currentLocation: e.target.value})} className="w-full px-6 py-5 bg-amber-50/20 border-2 border-amber-100/30 rounded-2xl outline-none font-black text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" placeholder="e.g. Faridabad Hub" />
                             </div>
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Arrival Window</label>
                               <input required value={editingShipment.estimatedDelivery} onChange={e => setEditingShipment({...editingShipment, estimatedDelivery: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" placeholder="e.g. 25 Feb, 2025" />
                             </div>
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Consignor Hub (Start)</label>
                               <input required value={editingShipment.origin} onChange={e => setEditingShipment({...editingShipment, origin: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" />
                             </div>
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Consignee Hub (End)</label>
                               <input required value={editingShipment.destination} onChange={e => setEditingShipment({...editingShipment, destination: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" />
                             </div>
                           </div>
                         </div>

                         {/* Client Information Section */}
                         <div className="space-y-8">
                           <div className="flex items-center gap-4">
                             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                             <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.4em]">Client Identity</h4>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sender Entity</label>
                               <input required value={editingShipment.sender} onChange={e => setEditingShipment({...editingShipment, sender: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" />
                             </div>
                             <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Receiver Entity</label>
                               <input required value={editingShipment.receiver} onChange={e => setEditingShipment({...editingShipment, receiver: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 focus:bg-white transition-all text-sm" />
                             </div>
                           </div>
                         </div>

                         {/* Public Log Section */}
                         <div className="space-y-8 pb-10">
                           <div className="flex items-center gap-4">
                             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                             <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.4em]">Operational Brief (Public)</h4>
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Shipment Update (Visible to Clients)</label>
                             <textarea required rows={4} value={editingShipment.description} onChange={e => setEditingShipment({...editingShipment, description: e.target.value})} className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] outline-none resize-none font-bold text-slate-950 text-base md:text-lg focus:border-amber-500 focus:bg-white transition-all italic leading-relaxed" placeholder="Detailed update for client transparency..." />
                             <div className="flex items-center gap-2 text-slate-400 px-2">
                               <AlertCircle size={14} />
                               <span className="text-[10px] font-bold uppercase tracking-widest">This information is live on the public website.</span>
                             </div>
                           </div>
                         </div>
                       </form>
                     </div>
                   </div>

                   {/* Modal Footer - Fixed Sticky Footer for Visibility on Mobile/Laptop */}
                   <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/90 backdrop-blur-xl sticky bottom-0 z-40 shrink-0">
                     <div className="flex flex-col md:flex-row gap-5 max-w-3xl mx-auto">
                       <button 
                         type="submit" 
                         form="shipment-form"
                         className="flex-[3] bg-slate-950 text-white py-5 md:py-6 rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-950/30 text-xs md:text-sm flex items-center justify-center gap-4"
                       >
                         <SaveIcon size={24} className="text-amber-500" /> Commit Consignment Data
                       </button>
                       <button 
                         type="button"
                         onClick={() => setEditingShipment(null)}
                         className="flex-1 px-10 py-5 md:py-6 bg-white border-2 border-slate-200 text-slate-400 rounded-3xl font-black uppercase tracking-widest hover:text-slate-950 hover:border-slate-300 transition-all text-[11px] md:text-xs"
                       >
                         Discard
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {[
              { label: 'Unread Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Fleet in Transit', value: shipments.filter(s => s.status !== 'delivered').length, icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Active Services', value: services.length, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Approved Feedback', value: testimonials.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 group">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[24px] ${stat.bg} flex items-center justify-center mb-10 transition-transform group-hover:rotate-6`}>
                  <stat.icon size={28} md:size={34} className={stat.color} />
                </div>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">{stat.label}</div>
                <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest">Prospect Details</th>
                    <th className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                    <th className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-8">
                        <div className="font-black text-slate-950 text-base">{item.name}</div>
                        <div className="text-xs text-slate-400 font-bold mt-1">{item.phone}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-sm text-slate-600 line-clamp-1 italic font-medium">"{item.notes}"</div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2">{item.service}</div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'new' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{item.status}</span>
                      </td>
                      <td className="px-10 py-8 text-right space-x-2">
                        <button className="p-3 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Resolve Lead"><CheckCircle2 size={22} /></button>
                        <button className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Log"><Trash2 size={22} /></button>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr><td colSpan={4} className="py-32 text-center text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Lead desk is currently empty</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 md:p-14 rounded-[56px] border border-slate-200 shadow-sm animate-in fade-in duration-500 max-w-5xl">
            <h3 className="text-3xl md:text-4xl font-black text-slate-950 mb-12 tracking-tighter">Business Infrastructure Profile</h3>
            <form className="space-y-12" onSubmit={e => {
              e.preventDefault();
              localStorage.setItem('dr_company_details', JSON.stringify(companyDetails));
              alert('Business profile updated successfully.');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { name: 'name', label: 'Registered Agency Name' },
                  { name: 'ceo', label: 'Active Proprietor' },
                  { name: 'phone', label: 'Strategic Hotline' },
                  { name: 'email', label: 'Primary Communications Desk' },
                  { name: 'gst', label: 'GST Identity Number' },
                  { name: 'location', label: 'Operating Base' }
                ].map(field => (
                  <div key={field.name} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{field.label}</label>
                    <input name={field.name} value={companyDetails[field.name as keyof CompanyDetails]} onChange={handleCompanyDetailChange} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Registered Corporate Address</label>
                <textarea name="address" rows={3} value={companyDetails.address} onChange={handleCompanyDetailChange} className="w-full px-7 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] outline-none resize-none font-bold text-slate-950 text-sm focus:border-amber-500 transition-all" />
              </div>
              <div className="pt-10 border-t border-slate-100">
                <button type="submit" className="w-full md:w-auto bg-slate-950 text-white px-14 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-950/20 text-xs flex items-center justify-center gap-4">
                  <Save size={20} className="text-amber-500" /> Commit Strategic Update
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

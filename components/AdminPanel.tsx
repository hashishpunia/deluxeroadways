
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Inbox, LogOut, Trash2, CheckCircle2, Clock, Truck, Users, Plus, Edit, Image as ImageIcon, X, Save, Upload, Settings, MapPin, Package, Navigation, ArrowRight, SaveIcon } from 'lucide-react';
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
    if (!confirm('Delete this shipment record?')) return;
    const updated = shipments.filter(s => s.id !== id);
    setShipments(updated);
    localStorage.setItem('dr_shipments', JSON.stringify(updated));
  };

  const updateInquiryStatus = (id: number, status: Inquiry['status']) => {
    const updated = inquiries.map(q => q.id === id ? { ...q, status } : q);
    setInquiries(updated);
    localStorage.setItem('dr_inquiries', JSON.stringify(updated));
  };

  const deleteInquiry = (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    const updated = inquiries.filter(q => q.id !== id);
    setInquiries(updated);
    localStorage.setItem('dr_inquiries', JSON.stringify(updated));
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.find(s => s.id === editingService.id) 
      ? services.map(s => s.id === editingService.id ? editingService : s)
      : [...services, editingService];
    setServices(updated);
    localStorage.setItem('dr_services', JSON.stringify(updated));
    setEditingService(null);
  };

  const deleteService = (id: string) => {
    if (!confirm('Delete this service permanently?')) return;
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('dr_services', JSON.stringify(updated));
  };

  const toggleTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, approved: !t.approved } : t);
    setTestimonials(updated);
    localStorage.setItem('dr_testimonials', JSON.stringify(updated));
  };

  const deleteTestimonial = (id: string) => {
    if (!confirm('Delete this review?')) return;
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    localStorage.setItem('dr_testimonials', JSON.stringify(updated));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SiteAssets) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAssets = { ...assets, [key]: reader.result as string };
        setAssets(newAssets);
        localStorage.setItem('dr_assets', JSON.stringify(newAssets));
      };
      reader.readAsDataURL(file);
    }
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
        <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-xl">
              <Settings size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faridabad Admin</h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Secure Access Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Passkey Credentials</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all font-mono text-center tracking-[0.5em] bg-slate-50"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-950/20 uppercase tracking-widest text-sm">
              Authorize Entry
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-950 transition-colors">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-amber-500 shadow-md">
              <Package size={16} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase text-slate-950">Deluxe<span className="text-amber-500">Admin</span></span>
          </div>
          
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
              { id: 'inquiries', icon: Inbox, label: 'Client Inquiries', count: inquiries.filter(i => i.status === 'new').length },
              { id: 'shipments', icon: MapPin, label: 'Tracking Hub' },
              { id: 'services', icon: Truck, label: 'Fleet Management' },
              { id: 'testimonials', icon: Users, label: 'Testimonials' },
              { id: 'assets', icon: ImageIcon, label: 'Visual Assets' },
              { id: 'settings', icon: Settings, label: 'Global Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-sm transition-all group ${activeTab === item.id ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeTab === item.id ? 'text-amber-500' : 'text-slate-300 group-hover:text-slate-950'} />
                  <span>{item.label}</span>
                </div>
                {item.count ? <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">{item.count}</span> : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button onClick={onClose} className="w-full flex items-center gap-3 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors group">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 px-6 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-amber-500" />
          <span className="text-xs font-black tracking-tighter uppercase">Deluxe<span className="text-amber-500">Admin</span></span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 bg-slate-50 p-2 rounded-lg"><LogOut size={20} /></button>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'inquiries', icon: Inbox },
          { id: 'shipments', icon: MapPin },
          { id: 'settings', icon: Settings }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)}
            className={`p-3.5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-slate-950 text-white scale-110 shadow-lg' : 'text-slate-400'}`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 md:p-12 pb-24 lg:pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div>
            <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Faridabad Operating Hub</div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
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
               estimatedDelivery: '3-5 Business Days',
               description: 'Consignment booked at Faridabad Hub. Scheduled for departure.'
             })}
             className="w-full md:w-auto bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 text-xs shadow-xl shadow-slate-950/20"
           >
             <Plus size={20} className="text-amber-500" /> New Consignment
           </button>
          )}
        </header>

        {/* SHIPMENTS TAB */}
        {activeTab === 'shipments' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Desktop List */}
            <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-950">{s.trackingNumber}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">To: {s.receiver}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Navigation size={14} className="text-amber-500" />
                          {s.currentLocation}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          {s.origin.split(',')[0]} <ArrowRight size={12} className="text-slate-300" /> {s.destination.split(',')[0] || '?'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                          s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingShipment(s)} className="p-2 text-slate-400 hover:text-slate-950 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all"><Edit size={18} /></button>
                          <button onClick={() => deleteShipment(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-red-100 shadow-sm transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {shipments.length === 0 && (
                    <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No active shipments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {shipments.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-black text-slate-950 tracking-tight">{s.trackingNumber}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">To: {s.receiver}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                    }`}>{s.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Navigation size={18} className="text-amber-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Location</span>
                      {s.currentLocation}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span>{s.origin.split(',')[0]}</span>
                      <ArrowRight size={14} className="text-amber-500" />
                      <span>{s.destination.split(',')[0] || '?'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingShipment(s)} className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100 active:scale-90"><Edit size={18} /></button>
                      <button onClick={() => deleteShipment(s.id)} className="p-3 bg-red-50 rounded-xl text-red-500 border border-red-100 active:scale-90"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit/New Shipment Modal */}
            {editingShipment && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[500] flex items-center justify-center p-0 md:p-6">
                <div className="bg-white w-full h-full md:h-auto md:max-w-3xl md:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 duration-500">
                   {/* Modal Header */}
                   <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500">
                          <Package size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Consignment Editor</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Real-time Tracking Data</p>
                        </div>
                     </div>
                     <button onClick={() => setEditingShipment(null)} className="p-2 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-full transition-all"><X size={24} /></button>
                   </div>
                   
                   {/* Modal Body */}
                   <div className="flex-1 overflow-y-auto p-6 md:p-10">
                     <form id="shipment-form" onSubmit={handleSaveShipment} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tracking ID (Generated)</label>
                           <input required value={editingShipment.trackingNumber} onChange={e => setEditingShipment({...editingShipment, trackingNumber: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-mono font-black text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Delivery Phase</label>
                           <select value={editingShipment.status} onChange={e => setEditingShipment({...editingShipment, status: e.target.value as ShipmentStatus})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-slate-950 uppercase tracking-widest text-xs focus:border-amber-500 transition-all cursor-pointer">
                              <option value="dispatched">Dispatched</option>
                              <option value="in-transit">In Transit</option>
                              <option value="near-destination">Near Destination Hub</option>
                              <option value="delivered">Delivered</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Current GPS Loc.</label>
                           <input required value={editingShipment.currentLocation} onChange={e => setEditingShipment({...editingShipment, currentLocation: e.target.value})} className="w-full px-5 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" placeholder="e.g. Jaipur Sorting Hub" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Delivery Date</label>
                           <input required value={editingShipment.estimatedDelivery} onChange={e => setEditingShipment({...editingShipment, estimatedDelivery: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pickup Point</label>
                           <input required value={editingShipment.origin} onChange={e => setEditingShipment({...editingShipment, origin: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Drop Point</label>
                           <input required value={editingShipment.destination} onChange={e => setEditingShipment({...editingShipment, destination: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Consignor (Sender)</label>
                           <input required value={editingShipment.sender} onChange={e => setEditingShipment({...editingShipment, sender: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Consignee (Receiver)</label>
                           <input required value={editingShipment.receiver} onChange={e => setEditingShipment({...editingShipment, receiver: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                         </div>
                       </div>
                       <div className="space-y-2 pb-6">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Log Update (Client Facing)</label>
                         <textarea required rows={3} value={editingShipment.description} onChange={e => setEditingShipment({...editingShipment, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none font-bold text-slate-950 text-sm focus:border-amber-500 transition-all italic" placeholder="e.g. Consignment successfully arrived at Mumbai Port. Customs clearance in progress." />
                       </div>
                     </form>
                   </div>

                   {/* Modal Footer */}
                   <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-20">
                     <div className="flex flex-col md:flex-row gap-3">
                       <button 
                         type="submit" 
                         form="shipment-form"
                         className="flex-1 bg-slate-950 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-950/20 text-xs md:text-sm flex items-center justify-center gap-3"
                       >
                         <SaveIcon size={20} className="text-amber-500" /> Commit Tracking Update
                       </button>
                       <button 
                         type="button"
                         onClick={() => setEditingShipment(null)}
                         className="px-8 py-4 md:py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:text-slate-950 transition-all text-[10px] md:text-xs"
                       >
                         Discard Changes
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {[
              { label: 'Unread Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Active Shipments', value: shipments.filter(s => s.status !== 'delivered').length, icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Fleet Options', value: services.length, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Reviews', value: testimonials.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} md:size={32} className={stat.color} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* OTHER TABS (Simplified for this update) */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Identity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-950">{item.name}</div>
                        <div className="text-xs text-slate-400 font-bold">{item.phone}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-slate-600 line-clamp-1 italic">"{item.notes}"</div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1.5">{item.service}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === 'new' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{item.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => updateInquiryStatus(item.id, 'resolved')} className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Mark Resolved"><CheckCircle2 size={18} /></button>
                        <button onClick={() => deleteInquiry(item.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Inquiry"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No customer inquiries found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 md:p-12 rounded-[40px] border border-slate-200 shadow-sm animate-in fade-in duration-500 max-w-5xl">
            <h3 className="text-2xl font-black text-slate-950 mb-10 tracking-tight">Business Profile & Credentials</h3>
            <form className="space-y-10" onSubmit={e => {
              e.preventDefault();
              localStorage.setItem('dr_company_details', JSON.stringify(companyDetails));
              alert('Business profile updated securely.');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: 'name', label: 'Company Registered Name' },
                  { name: 'ceo', label: 'Proprietor / CEO' },
                  { name: 'phone', label: 'Corporate Hotline' },
                  { name: 'email', label: 'Official Correspondence Email' },
                  { name: 'gst', label: 'GST Identification Number' },
                  { name: 'location', label: 'Headquarters Base' }
                ].map(field => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                    <input name={field.name} value={companyDetails[field.name as keyof CompanyDetails]} onChange={handleCompanyDetailChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Office Address</label>
                <textarea name="address" rows={3} value={companyDetails.address} onChange={handleCompanyDetailChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none resize-none font-bold text-slate-950 text-sm focus:border-amber-500 transition-all" />
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button type="submit" className="w-full md:w-auto bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-950/20 text-xs flex items-center justify-center gap-3">
                  <Save size={18} className="text-amber-500" /> Commit Global Settings
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


import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Inbox, LogOut, Trash2, CheckCircle2, Clock, Truck, Users, Plus, Edit, Image as ImageIcon, X, Save, Upload, Settings, MapPin, Package } from 'lucide-react';
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

  const handleSaveShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;
    
    if (shipments.find(s => s.id === editingShipment.id)) {
      setShipments(shipments.map(s => s.id === editingShipment.id ? { ...editingShipment, lastUpdate: new Date().toLocaleString() } : s));
    } else {
      setShipments([...shipments, { ...editingShipment, lastUpdate: new Date().toLocaleString() }]);
    }
    setEditingShipment(null);
  };

  const deleteShipment = (id: string) => {
    if (!confirm('Delete this shipment record?')) return;
    setShipments(shipments.filter(s => s.id !== id));
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    
    if (services.find(s => s.id === editingService.id)) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
    } else {
      setServices([...services, editingService]);
    }
    setEditingService(null);
  };

  const deleteService = (id: string) => {
    if (!confirm('Delete this service permanently?')) return;
    setServices(services.filter(s => s.id !== id));
  };

  const toggleTestimonial = (id: string) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, approved: !t.approved } : t));
  };

  const deleteTestimonial = (id: string) => {
    if (!confirm('Delete this review?')) return;
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SiteAssets) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssets({ ...assets, [key]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingService({ ...editingService, image: reader.result as string });
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <Truck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Control</h1>
            <p className="text-slate-400 text-sm mt-1">Faridabad Headquarters Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Passkey</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all">
              Login to Dashboard
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 text-sm font-bold hover:text-slate-900 transition-colors">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Truck size={16} />
            </div>
            <span className="text-sm font-black tracking-tight uppercase">Deluxe<span className="text-amber-500">Admin</span></span>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'inquiries', icon: Inbox, label: 'Inquiries', count: inquiries.filter(i => i.status === 'new').length },
              { id: 'shipments', icon: MapPin, label: 'Tracking System' },
              { id: 'services', icon: Truck, label: 'Manage Services' },
              { id: 'testimonials', icon: Users, label: 'Testimonials' },
              { id: 'assets', icon: ImageIcon, label: 'Site Assets' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count ? <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px]">{item.count}</span> : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button onClick={onClose} className="w-full flex items-center gap-3 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-400 font-medium mt-1">Management Panel for Deluxe Roadways</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {[
              { label: 'Active Inquiries', value: inquiries.length, icon: Inbox, color: 'text-blue-500' },
              { label: 'Live Shipments', value: shipments.length, icon: MapPin, color: 'text-amber-500' },
              { label: 'Fleet Services', value: services.length, icon: Truck, color: 'text-purple-500' },
              { label: 'Total Reviews', value: testimonials.length, icon: Users, color: 'text-green-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Consignment Tracking Management</h3>
              <button 
                onClick={() => setEditingShipment({ 
                  id: Date.now().toString(), 
                  trackingNumber: `DR-2025-${Math.floor(100 + Math.random() * 900)}`, 
                  sender: '', 
                  receiver: '', 
                  origin: '', 
                  destination: '', 
                  status: 'dispatched', 
                  lastUpdate: new Date().toLocaleString(),
                  estimatedDelivery: '3-5 Business Days',
                  description: 'Shipment dispatched from Faridabad Hub.'
                })}
                className="btn-primary flex gap-2 items-center"
              >
                <Plus size={18} /> New Consignment
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{s.trackingNumber}</div>
                        <div className="text-[10px] text-slate-400 font-medium">To: {s.receiver}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700">{s.origin} <span className="text-amber-500">→</span> {s.destination}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{s.lastUpdate}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                          s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button onClick={() => setEditingShipment(s)} className="p-2 text-slate-400 hover:text-slate-900"><Edit size={18} /></button>
                        <button onClick={() => deleteShipment(s.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editingShipment && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
                <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden">
                   <button onClick={() => setEditingShipment(null)} className="absolute top-6 right-8 text-slate-400 hover:text-slate-950"><X size={24} /></button>
                   <h3 className="text-2xl font-black mb-8">Update Consignment</h3>
                   <form onSubmit={handleSaveShipment} className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Number</label>
                         <input required value={editingShipment.trackingNumber} onChange={e => setEditingShipment({...editingShipment, trackingNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none font-mono" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</label>
                         <select value={editingShipment.status} onChange={e => setEditingShipment({...editingShipment, status: e.target.value as ShipmentStatus})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none">
                            <option value="dispatched">Dispatched</option>
                            <option value="in-transit">In Transit</option>
                            <option value="near-destination">Near Destination Hub</option>
                            <option value="delivered">Delivered</option>
                         </select>
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</label>
                         <input required value={editingShipment.origin} onChange={e => setEditingShipment({...editingShipment, origin: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</label>
                         <input required value={editingShipment.destination} onChange={e => setEditingShipment({...editingShipment, destination: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Name</label>
                         <input required value={editingShipment.sender} onChange={e => setEditingShipment({...editingShipment, sender: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiver Name</label>
                         <input required value={editingShipment.receiver} onChange={e => setEditingShipment({...editingShipment, receiver: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                       </div>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Delivery Date</label>
                       <input value={editingShipment.estimatedDelivery} onChange={e => setEditingShipment({...editingShipment, estimatedDelivery: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Updates (Displayed to Client)</label>
                       <textarea required rows={3} value={editingShipment.description} onChange={e => setEditingShipment({...editingShipment, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none resize-none" placeholder="e.g., Cargo reached Jaipur warehouse for further dispatch." />
                     </div>
                     <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">Update Tracking <Save size={18} /></button>
                   </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{item.phone}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-600 line-clamp-1">{item.notes}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.service}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'new' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{item.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button onClick={() => updateInquiryStatus(item.id, 'resolved')} className="p-2 text-slate-400 hover:text-green-600"><CheckCircle2 size={18} /></button>
                      <button onClick={() => deleteInquiry(item.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Manage Fleet Offerings</h3>
              <button 
                onClick={() => setEditingService({ id: Date.now().toString(), title: '', description: '', icon: 'truck', image: '' })}
                className="btn-primary flex gap-2 items-center"
              >
                <Plus size={18} /> Add New Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(s => (
                <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-200 group">
                  <div className="aspect-video bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                    <img src={s.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{s.title}</h4>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">{s.description}</p>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingService(s)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => deleteService(s.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
            {editingService && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
                <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl relative overflow-hidden">
                   <button onClick={() => setEditingService(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-950"><X size={24} /></button>
                   <h3 className="text-2xl font-black mb-8">Edit Service</h3>
                   <form onSubmit={handleSaveService} className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Title</label>
                         <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Theme</label>
                         <select value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none">
                            <option value="truck">General Truck</option>
                            <option value="thermometer">Cold Chain</option>
                            <option value="trash-2">Waste Disposal</option>
                            <option value="zap">Tata Shaktee</option>
                            <option value="box">Box Truck</option>
                         </select>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Image</label>
                       <div className="flex items-center gap-4">
                         {editingService.image && (
                           <img src={editingService.image} className="w-20 h-20 object-cover rounded-xl border" />
                         )}
                         <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl h-20 hover:bg-slate-50 cursor-pointer transition-colors">
                           <Upload size={18} className="text-slate-400 mb-1" />
                           <span className="text-[10px] font-black text-slate-400 uppercase">Upload Image</span>
                           <input type="file" accept="image/*" className="hidden" onChange={handleServiceImageUpload} />
                         </label>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                       <textarea required rows={4} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none resize-none" />
                     </div>
                     <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">Save Offering <Save size={18} /></button>
                   </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4">
            {[
              { label: 'Hero Background Image', key: 'heroImage', desc: 'Main image displayed at the top of the homepage.' },
              { label: 'About Section Visual', key: 'aboutImage', desc: 'Large image showcasing company heritage.' }
            ].map(asset => (
              <div key={asset.key} className="bg-white p-8 rounded-[40px] border border-slate-200">
                <div className="mb-6">
                  <h4 className="text-lg font-black text-slate-900">{asset.label}</h4>
                  <p className="text-xs text-slate-400 font-medium">{asset.desc}</p>
                </div>
                <div className="aspect-video bg-slate-100 rounded-3xl mb-8 overflow-hidden border border-slate-200 shadow-inner">
                   <img src={assets[asset.key as keyof SiteAssets]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer">
                      <Upload size={18} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">Upload New Local Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImageChange(e, asset.key as keyof SiteAssets)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm animate-in fade-in max-w-4xl">
            <h3 className="text-xl font-bold mb-8">Business Information Settings</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                  <input name="name" value={companyDetails.name} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proprietor Name</label>
                  <input name="ceo" value={companyDetails.ceo} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                  <input name="phone" value={companyDetails.phone} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                  <input name="email" value={companyDetails.email} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Number</label>
                  <input name="gst" value={companyDetails.gst} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Established Year</label>
                  <input type="number" name="estd" value={companyDetails.estd} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location (City, State)</label>
                <input name="location" value={companyDetails.location} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Office Address</label>
                <textarea name="address" rows={3} value={companyDetails.address} onChange={handleCompanyDetailChange} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none resize-none" />
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setCompanyDetails(companyDetails);
                  localStorage.setItem('dr_company_details', JSON.stringify(companyDetails));
                  alert('Business details updated successfully!');
                }} 
                className="btn-primary flex items-center gap-2"
              >
                <Save size={18} /> Update Business Details
              </button>
            </form>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
             <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedback</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.company}</div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      <p className="text-sm text-slate-600 italic">"{t.quote}"</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.approved ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{t.approved ? 'Public' : 'Hidden'}</span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button onClick={() => toggleTestimonial(t.id)} className={`p-2 rounded-lg transition-colors ${t.approved ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'}`}>{t.approved ? <X size={16} /> : <CheckCircle2 size={16} />}</button>
                      <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

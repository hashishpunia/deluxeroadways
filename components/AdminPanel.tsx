
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Inbox, LogOut, Trash2, CheckCircle2, Clock, 
  Truck, Users, Plus, Edit, Image as ImageIcon, X, Save, 
  Upload, Settings, MapPin, Package, Navigation, ArrowRight, 
  SaveIcon, AlertCircle, RefreshCw, Facebook, Twitter, Linkedin, Instagram, Link
} from 'lucide-react';
import { Service, Testimonial, SiteAssets, CompanyDetails, Shipment, ShipmentStatus, SocialLink, FooterLink } from '../types.ts';

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
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

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
    const updated = isNew 
      ? [...shipments, { ...editingShipment, lastUpdate: new Date().toLocaleString() }] 
      : shipments.map(s => s.id === editingShipment.id ? { ...editingShipment, lastUpdate: new Date().toLocaleString() } : s);
    setShipments(updated);
    setEditingShipment(null);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const isNew = !services.find(s => s.id === editingService.id);
    const updated = isNew ? [...services, editingService] : services.map(s => s.id === editingService.id ? editingService : s);
    setServices(updated);
    setEditingService(null);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    const isNew = !testimonials.find(t => t.id === editingTestimonial.id);
    const updated = isNew ? [...testimonials, editingTestimonial] : testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
    setTestimonials(updated);
    setEditingTestimonial(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyDetails({ ...companyDetails, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SiteAssets) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssets({ ...assets, [key]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-2xl">
              <Settings size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Gateway</h1>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-black">Authorized Personnel Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono text-center tracking-[0.5em] bg-slate-50 text-xl font-bold"
              placeholder="••••••••"
              autoFocus
            />
            <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
              Authenticate Entry
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-950 transition-colors py-4">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0 sticky top-0 h-screen z-50 shadow-sm">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-amber-500">
              <Package size={20} />
            </div>
            <span className="text-lg font-black uppercase text-slate-950">Deluxe<br/><span className="text-amber-500 text-xs">Operations</span></span>
          </div>
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
              { id: 'inquiries', icon: Inbox, label: 'Inquiry Inbox', count: inquiries.filter(i => i.status === 'new').length },
              { id: 'shipments', icon: MapPin, label: 'Consignment Hub' },
              { id: 'services', icon: Truck, label: 'Fleet Management' },
              { id: 'testimonials', icon: Users, label: 'Client Feedback', count: testimonials.filter(t => !t.approved).length },
              { id: 'assets', icon: ImageIcon, label: 'Media Assets' },
              { id: 'settings', icon: Settings, label: 'Global Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={activeTab === item.id ? 'text-amber-500' : 'text-slate-300'} />
                  <span>{item.label}</span>
                </div>
                {item.count ? <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black">{item.count}</span> : null}
              </button>
            ))}
          </nav>
          <button onClick={onClose} className="w-full flex items-center gap-4 text-slate-400 font-black text-xs uppercase hover:text-red-500 mt-10">
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 md:p-14 pb-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-3">Faridabad Headquarters</div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter capitalize leading-none">{activeTab.replace('-', ' ')}</h2>
          </div>
          {activeTab === 'shipments' && (
            <button onClick={() => setEditingShipment({ id: Date.now().toString(), trackingNumber: generateYearlyTrackingId(), sender: '', receiver: '', origin: 'Faridabad, HR', destination: '', currentLocation: 'Faridabad Hub', status: 'dispatched', lastUpdate: new Date().toLocaleString(), estimatedDelivery: '3-5 Working Days', description: 'Consignment booked. Scheduled for dispatch.' })} className="btn-primary gap-3 shadow-xl shadow-slate-950/20"><Plus size={20} /> New Consignment</button>
          )}
          {activeTab === 'services' && (
            <button onClick={() => setEditingService({ id: Date.now().toString(), title: '', description: '', icon: 'truck', image: '' })} className="btn-primary gap-3 shadow-xl shadow-slate-950/20"><Plus size={20} /> Add Service</button>
          )}
          {activeTab === 'testimonials' && (
            <button onClick={() => setEditingTestimonial({ id: Date.now().toString(), name: '', company: '', role: 'Client', quote: '', rating: 5, approved: true })} className="btn-primary gap-3 shadow-xl shadow-slate-950/20"><Plus size={20} /> New Feedback</button>
          )}
        </header>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {[
              { label: 'Unread Inquiries', value: inquiries.filter(i => i.status === 'new').length, icon: Inbox, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Live Shipments', value: shipments.filter(s => s.status !== 'delivered').length, icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Fleet Options', value: services.length, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Total Reviews', value: testimonials.length, icon: Users, color: 'text-green-500', bg: 'bg-green-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 rounded-[24px] ${stat.bg} flex items-center justify-center mb-8 transition-transform group-hover:scale-110`}>
                  <stat.icon size={30} className={stat.color} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Consignment Hub View */}
        {activeTab === 'shipments' && (
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tracking ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Route</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shipments.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{s.trackingNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold">{s.origin.split(',')[0]} → {s.destination.split(',')[0]}</div>
                      <div className="text-[10px] text-slate-400">{s.currentLocation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        s.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                        s.status === 'in-transit' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingShipment(s)} className="p-2 text-slate-400 hover:text-slate-950 transition-colors"><Edit size={16} /></button>
                        <button onClick={() => setShipments(shipments.filter(item => item.id !== s.id))} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fleet Management View */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in">
            {services.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-[32px] border border-slate-200 flex flex-col group">
                <div className="aspect-video bg-slate-50 rounded-2xl mb-6 overflow-hidden">
                  {s.image ? <img src={s.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><Truck size={40} /></div>}
                </div>
                <h4 className="font-black text-lg text-slate-900 mb-2">{s.title}</h4>
                <p className="text-sm text-slate-500 mb-8 line-clamp-2">{s.description}</p>
                <div className="mt-auto flex gap-3 pt-6 border-t border-slate-50">
                  <button onClick={() => setEditingService(s)} className="flex-1 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100"><Edit size={16} /> Edit</button>
                  <button onClick={() => setServices(services.filter(serv => serv.id !== s.id))} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials View */}
        {activeTab === 'testimonials' && (
          <div className="space-y-12 animate-in fade-in">
            {testimonials.filter(t => !t.approved).length > 0 && (
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">Inbox (Pending Approval)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.filter(t => !t.approved).map(t => (
                    <div key={t.id} className="bg-amber-50/50 p-6 rounded-[32px] border border-amber-100 shadow-sm">
                      <p className="italic text-slate-700 mb-6 text-sm">"{t.quote}"</p>
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black">{t.company}</div>
                      <div className="mt-6 flex gap-3 pt-4 border-t border-amber-100">
                        <button onClick={() => setTestimonials(testimonials.map(item => item.id === t.id ? { ...item, approved: true } : item))} className="flex-1 bg-slate-950 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                        <button onClick={() => setTestimonials(testimonials.filter(item => item.id !== t.id))} className="px-4 bg-red-50 text-red-500 rounded-xl"><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Approved Feedbacks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.filter(t => t.approved).map(t => (
                  <div key={t.id} className="bg-white p-6 rounded-[32px] border border-slate-200 group">
                    <p className="italic text-slate-700 mb-6 text-sm">"{t.quote}"</p>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black">{t.company}</div>
                    <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingTestimonial(t)} className="p-2 text-slate-400 hover:text-slate-950 transition-colors"><Edit size={16} /></button>
                      <button onClick={() => setTestimonials(testimonials.filter(item => item.id !== t.id))} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Settings View */}
        {activeTab === 'settings' && (
          <div className="bg-white p-10 md:p-14 rounded-[40px] border border-slate-200 shadow-sm max-w-5xl animate-in fade-in">
            <h3 className="text-3xl font-black text-slate-950 mb-12 tracking-tight">Business Configuration</h3>
            <form className="space-y-12" onSubmit={e => { e.preventDefault(); alert('Settings saved successfully!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Identity</label>
                  <input value={companyDetails.name} onChange={e => setCompanyDetails({ ...companyDetails, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Company Name" />
                  <div className="flex items-center gap-4 mt-2">
                    {companyDetails.logo && <img src={companyDetails.logo} className="w-12 h-12 object-contain rounded bg-slate-100" />}
                    <label className="flex-1 py-3 px-6 bg-slate-950 text-white rounded-xl text-[10px] font-black text-center cursor-pointer uppercase tracking-widest">Update Logo <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} /></label>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leadership</label>
                  <input value={companyDetails.ceo} onChange={e => setCompanyDetails({ ...companyDetails, ceo: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Proprietor Name" />
                  <input value={companyDetails.estd} onChange={e => setCompanyDetails({ ...companyDetails, estd: parseInt(e.target.value) || 2017 })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="Established Year" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Section Content</label>
                <textarea value={companyDetails.aboutText} onChange={e => setCompanyDetails({ ...companyDetails, aboutText: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium h-32 resize-none" placeholder="Enter company history..." />
              </div>
              <div className="pt-10 border-t border-slate-100 flex justify-end">
                <button type="submit" className="bg-slate-950 text-white px-14 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl flex items-center gap-3"><Save size={18} className="text-amber-500" /> Save Settings</button>
              </div>
            </form>
          </div>
        )}

        {/* Media Assets View */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in">
            {[
              { key: 'heroImage', label: 'Main Landing Banner', desc: 'First impression visual for visitors.' },
              { key: 'aboutImage', label: 'Heritage Visual', desc: 'Used in the About company section.' }
            ].map(item => (
              <div key={item.key} className="bg-white p-8 rounded-[40px] border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-black text-slate-950">{item.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                  <label className="bg-slate-950 text-white p-3 rounded-xl cursor-pointer hover:bg-black transition-all">
                    <Upload size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleAssetUpload(e, item.key as any)} />
                  </label>
                </div>
                <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border">
                  <img src={assets[item.key as keyof SiteAssets]} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editing Modals */}
        {editingService && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[500] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20 shrink-0">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">Fleet Configuration</h3>
                <button onClick={() => setEditingService(null)} className="p-2 text-slate-400 hover:text-slate-950 rounded-full transition-all"><X size={32} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <form id="service-form" onSubmit={handleSaveService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Title</label>
                      <input required value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Icon Style</label>
                      <select value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black uppercase tracking-widest text-[11px]">
                        <option value="truck">General Trucking</option>
                        <option value="thermometer">Refrigerated</option>
                        <option value="trash-2">Waste Logistics</option>
                        <option value="box">Box Truck</option>
                        <option value="zap">Express Delivery</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Feature Image URL</label>
                    <input value={editingService.image} onChange={e => setEditingService({...editingService, image: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" placeholder="Image URL..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                    <textarea required rows={4} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                </form>
              </div>
              <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 sticky bottom-0">
                <button type="submit" form="service-form" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><SaveIcon size={20} className="text-amber-500" /> Save Fleet Option</button>
              </div>
            </div>
          </div>
        )}

        {editingShipment && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[500] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">Consignment Manifest</h3>
                <button onClick={() => setEditingShipment(null)} className="p-2 text-slate-400 hover:text-slate-950 rounded-full transition-all"><X size={32} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <form id="shipment-form" onSubmit={handleSaveShipment} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tracking ID</label>
                      <input readOnly value={editingShipment.trackingNumber} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                      <select value={editingShipment.status} onChange={e => setEditingShipment({...editingShipment, status: e.target.value as ShipmentStatus})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black uppercase text-[10px] tracking-widest">
                        <option value="dispatched">Dispatched</option>
                        <option value="in-transit">In Transit</option>
                        <option value="near-destination">Near Destination</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Origin Hub</label>
                      <input required value={editingShipment.origin} onChange={e => setEditingShipment({...editingShipment, origin: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Destination Hub</label>
                      <input required value={editingShipment.destination} onChange={e => setEditingShipment({...editingShipment, destination: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Live Location Description</label>
                    <input required value={editingShipment.currentLocation} onChange={e => setEditingShipment({...editingShipment, currentLocation: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Operations Summary</label>
                    <textarea required rows={3} value={editingShipment.description} onChange={e => setEditingShipment({...editingShipment, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-sm italic resize-none" />
                  </div>
                </form>
              </div>
              <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/50 sticky bottom-0">
                <button type="submit" form="shipment-form" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><Save size={18} className="text-amber-500" /> Save Manifest</button>
              </div>
            </div>
          </div>
        )}

        {editingTestimonial && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[500] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">Review Adjustment</h3>
                <button onClick={() => setEditingTestimonial(null)} className="p-2 text-slate-400 hover:text-slate-950 rounded-full transition-all"><X size={32} /></button>
              </div>
              <div className="p-6 md:p-10">
                <form onSubmit={handleSaveTestimonial} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Name</label>
                      <input required value={editingTestimonial.name} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Company</label>
                      <input required value={editingTestimonial.company} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Statement</label>
                    <textarea required rows={4} value={editingTestimonial.quote} onChange={e => setEditingTestimonial({...editingTestimonial, quote: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-sm italic resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><Save size={18} className="text-amber-500" /> Save Review</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

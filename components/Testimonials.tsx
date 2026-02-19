
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Plus, X, Send, Play, Pause } from 'lucide-react';
import { Testimonial } from '../types.ts';

interface TestimonialsProps {
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, setTestimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', company: '', quote: '', rating: 5 });
  const intervalRef = useRef<number | null>(null);

  const approvedTestimonials = testimonials.filter(t => t.approved);

  const isPaused = isHoverPaused || isManualPaused;

  const handleNext = useCallback(() => {
    if (isAnimating || approvedTestimonials.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === approvedTestimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, approvedTestimonials.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || approvedTestimonials.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? approvedTestimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, approvedTestimonials.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (approvedTestimonials.length > 1 && !isPaused) {
      intervalRef.current = window.setInterval(handleNext, 3000);
    } else {
      if(intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if(intervalRef.current) clearInterval(intervalRef.current); };
  }, [handleNext, approvedTestimonials.length, isPaused]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const testimonial: Testimonial = {
      id: Date.now().toString(),
      ...newReview,
      role: 'Client',
      approved: false
    };
    setTestimonials([...testimonials, testimonial]);
    setIsModalOpen(false);
    setNewReview({ name: '', company: '', quote: '', rating: 5 });
    alert('Thank you! Your feedback has been sent for administrative review.');
  };

  if (approvedTestimonials.length === 0) return null;

  return (
    <section 
      id="testimonials" 
      className="section-padding bg-slate-50 overflow-hidden px-4"
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      onTouchStart={() => setIsHoverPaused(true)}
      onTouchEnd={() => setIsHoverPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 relative">
          <h2 className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-amber-500 mb-6">CLIENT SUCCESS</h2>
          <h3 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">
            Trusted by Industry Leaders.
          </h3>
          <p className="text-slate-500 text-base md:text-xl font-semibold max-w-2xl mx-auto leading-relaxed mb-8">
            Businesses across India rely on Deluxe Roadways for their critical logistics requirements.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 mx-auto text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> WRITE A REVIEW
          </button>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card - Slightly Smaller size adjusted via padding and max-width */}
          <div 
            className={`relative bg-white p-8 md:p-16 rounded-[48px] md:rounded-[56px] transition-all duration-700 ease-out ${isPaused ? 'shadow-2xl scale-[1.01] border-amber-200 border-2' : 'shadow-xl scale-100 border-transparent border-2'} overflow-hidden min-h-[380px] md:min-h-[460px] flex flex-col justify-center`}
          >
            <div 
              className={`transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 -translate-y-4 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}
            >
              <div className="flex gap-2 mb-8 md:mb-10">
                {[...Array(approvedTestimonials[currentIndex].rating)].map((_, idx) => (
                  <Star key={idx} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <div className="mb-8 md:mb-14 relative">
                <Quote size={80} className="text-slate-50 absolute -top-12 -left-8 -z-0 opacity-80" />
                <p className="text-xl md:text-4xl text-slate-900 font-bold leading-[1.2] relative z-10 tracking-tight italic">
                  "{approvedTestimonials[currentIndex].quote}"
                </p>
              </div>

              <div className="flex items-center gap-5 md:gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-[24px] md:rounded-[32px] flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl">
                  {approvedTestimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg md:text-2xl font-black text-slate-950 tracking-tight leading-none mb-1">
                    {approvedTestimonials[currentIndex].name}
                  </h4>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    {approvedTestimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`absolute bottom-6 right-10 text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] transition-opacity duration-300 ${isPaused ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
              {isManualPaused ? 'Manually Paused' : 'Paused on Interaction'}
            </div>
          </div>

          {/* Navigation Controls */}
          {approvedTestimonials.length > 1 && (
            <div className="flex justify-center md:justify-between items-center mt-10 md:mt-0 gap-6 md:absolute md:top-1/2 md:-translate-y-1/2 md:w-[calc(100%+140px)] md:-left-[70px]">
              <button onClick={handlePrev} className="p-6 rounded-full bg-white border border-slate-100 text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-xl active:scale-90 group hidden md:block">
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={handleNext} className="p-6 rounded-full bg-white border border-slate-100 text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-xl active:scale-90 group hidden md:block">
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Indicators, Play/Pause and Dots */}
          <div className="flex flex-col items-center gap-6 mt-10">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsManualPaused(!isManualPaused)}
                className="p-3 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-slate-950 hover:border-slate-400 transition-all active:scale-90"
                title={isManualPaused ? "Play Autoplay" : "Pause Autoplay"}
              >
                {isManualPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
              </button>
              
              <div className="flex gap-2.5">
                {approvedTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      currentIndex === idx 
                      ? 'w-10 bg-amber-500 shadow-md shadow-amber-500/20' 
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="md:hidden flex gap-4">
                <button onClick={handlePrev} className="p-3 bg-white border border-slate-100 rounded-full shadow-md text-slate-950">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} className="p-3 bg-white border border-slate-100 rounded-full shadow-md text-slate-950">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Slide {currentIndex + 1} of {approvedTestimonials.length}
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[500] flex items-center justify-center p-6">
          <div className="bg-white rounded-[64px] p-12 md:p-20 w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-500">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-16 right-16 text-slate-300 hover:text-slate-950 transition-all"><X size={48} /></button>
            <div className="overflow-y-auto px-1">
              <h3 className="text-4xl md:text-5xl font-black mb-12 tracking-tighter text-slate-950 leading-none">Share Your <br/><span className="text-slate-300">Corporate Feedback.</span></h3>
              <form onSubmit={handleSubmitReview} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Official Correspondent</label>
                    <input required value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" placeholder="Full Name" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Entity Name</label>
                    <input required value={newReview.company} onChange={e => setNewReview({...newReview, company: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none font-bold text-slate-950 focus:border-amber-500 transition-all" placeholder="Company Name" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Logistical Statement</label>
                  <textarea required rows={5} value={newReview.quote} onChange={e => setNewReview({...newReview, quote: e.target.value})} className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-50 rounded-[40px] outline-none resize-none font-semibold text-xl italic text-slate-700 leading-relaxed focus:border-amber-500 transition-all" placeholder="Tell us about your experience..." />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Industrial Grade</label>
                  <div className="flex gap-4 p-8 bg-slate-50 rounded-[32px] border-2 border-slate-50 justify-center">
                    {[1,2,3,4,5].map(num => (
                      <button key={num} type="button" onClick={() => setNewReview({...newReview, rating: num})} className="transition-transform hover:scale-125">
                        <Star size={48} className={num <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-8 text-base gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  Commit To Public Record <Send size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;

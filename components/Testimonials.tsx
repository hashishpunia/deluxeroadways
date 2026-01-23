
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Plus, X, Send } from 'lucide-react';
import { Testimonial } from '../types.ts';

interface TestimonialsProps {
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, setTestimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', company: '', quote: '', rating: 5 });

  const approvedTestimonials = testimonials.filter(t => t.approved);

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

  useEffect(() => {
    if (approvedTestimonials.length > 1) {
      const timer = setInterval(handleNext, 8000);
      return () => clearInterval(timer);
    }
  }, [handleNext, approvedTestimonials.length]);

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
    alert('Thank you! Your testimonial has been submitted for review.');
  };

  if (approvedTestimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-slate-50 overflow-hidden px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16 relative">
          <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-amber-600 mb-4 md:mb-6">Client Success</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Industry Leaders.
          </h3>
          <p className="text-slate-500 mt-4 md:text-lg font-medium max-w-2xl mx-auto">
            Businesses across India rely on Deluxe Roadways for their critical logistics requirements.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Write a Review
          </button>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Carousel Card */}
          <div className="relative bg-white p-6 md:p-16 rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-xl overflow-hidden min-h-[360px] md:min-h-[400px] flex flex-col justify-center">
            <div 
              className={`transition-all duration-500 ease-in-out transform ${isAnimating ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}
            >
              <div className="flex gap-1 mb-6 md:mb-8">
                {[...Array(approvedTestimonials[currentIndex].rating)].map((_, idx) => (
                  <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <div className="mb-8 md:mb-12 relative">
                <Quote size={40} md:size={80} className="text-slate-50 absolute -top-4 md:-top-10 -left-2 md:-left-6 -z-0" />
                <p className="text-lg md:text-3xl text-slate-700 font-medium leading-relaxed relative z-10 italic">
                  "{approvedTestimonials[currentIndex].quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg shadow-slate-900/20">
                  {approvedTestimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">
                    {approvedTestimonials[currentIndex].name}
                  </h4>
                  <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest">
                    {approvedTestimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {approvedTestimonials.length > 1 && (
            <div className="flex justify-center md:justify-between items-center mt-8 md:mt-0 gap-6 md:absolute md:top-1/2 md:-translate-y-1/2 md:w-[calc(100%+100px)] md:-left-[50px]">
              <button onClick={handlePrev} className="p-3 md:p-4 rounded-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-90">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNext} className="p-3 md:p-4 rounded-full bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-90">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-8 md:p-12 w-full max-w-xl shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <h3 className="text-2xl font-black mb-8">Write a Testimonial</h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Name</label>
                  <input required value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</label>
                  <input required value={newReview.company} onChange={e => setNewReview({...newReview, company: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Review</label>
                <textarea required rows={4} value={newReview.quote} onChange={e => setNewReview({...newReview, quote: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none resize-none" placeholder="Tell us about your experience..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(num => (
                    <button key={num} type="button" onClick={() => setNewReview({...newReview, rating: num})} className="p-1">
                      <Star size={24} className={num <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                Submit for Approval <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;

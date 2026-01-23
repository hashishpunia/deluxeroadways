
import React from 'react';
import { STATS } from '../constants.tsx';

const Stats: React.FC = () => {
  return (
    <section id="network" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-4xl font-extrabold text-slate-900 mb-2 transition-transform group-hover:scale-110 duration-300">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;


import React from 'react';
import { WeeklyLetter } from '../types';

interface WeeklyLetterViewProps {
  letter: WeeklyLetter;
}

const WeeklyLetterView: React.FC<WeeklyLetterViewProps> = ({ letter }) => {
  return (
    <div className="relative p-8 sm:p-12 bg-[#fffdfa] rounded-xl shadow-lg border border-stone-200 overflow-hidden group">
      {/* Stationery Background Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
        backgroundSize: '100% 2rem'
      }}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-bold block mb-2">Weekly Reflection</span>
            <h3 className="serif text-3xl font-bold text-stone-800 italic tracking-tight">{letter.weekLabel}</h3>
          </div>
          <div className="w-14 h-14 bg-stone-50 border border-stone-200 rounded-full flex items-center justify-center text-stone-300 shadow-sm">
            <i className="fas fa-stamp text-2xl"></i>
          </div>
        </div>

        <div className="space-y-6">
          <p className="serif text-xl leading-loose text-stone-700 italic whitespace-pre-wrap">
            {letter.content}
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-100 flex flex-wrap gap-3">
          {letter.themes.map(theme => (
            <span key={theme} className="px-4 py-1.5 bg-emerald-50/50 text-emerald-800 text-[11px] font-bold uppercase tracking-widest rounded-full border border-emerald-100/50 shadow-sm">
              {theme}
            </span>
          ))}
        </div>

        <div className="mt-10 text-right">
          <p className="serif italic text-stone-500 font-medium">— Your Capsule Archivist</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLetterView;


import React from 'react';
import { CapsuleEntry } from '../types';

interface ArchiveTimelineProps {
  entries: CapsuleEntry[];
}

const ArchiveTimeline: React.FC<ArchiveTimelineProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400 opacity-50 animate-in fade-in">
        <i className="fas fa-calendar-times text-6xl mb-4"></i>
        <p className="italic text-center px-6">The archive is silent for this period. <br /> Capture a memory to fill the space.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20">
      {entries.map((entry) => (
        <div key={entry.id} className="relative flex items-start gap-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center z-10 text-[10px] shadow-md border border-stone-700">
              <i className={`fas ${entry.mood === 'Stressed' ? 'fa-bolt' : entry.mood === 'Reflective' ? 'fa-leaf' : 'fa-sun'}`}></i>
            </div>
            <div className="w-px h-full bg-stone-200 absolute top-8 left-4 -translate-x-1/2"></div>
          </div>

          <div className="flex-1 rounded-[1.8rem] overflow-hidden border border-stone-100 bg-white shadow-sm hover:shadow-md transition-all active:scale-[0.99] group">
            {(entry.imageUrl || entry.userImageUrl) && (
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-100">
                <img src={entry.userImageUrl || entry.imageUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt="Moment" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-3">
                <time className="serif italic text-stone-400 text-[10px]">{new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400 bg-stone-50 px-2 py-1 rounded-md">{entry.mood}</span>
              </div>

              <h4 className="text-stone-800 font-bold text-base sm:text-xl mb-4 leading-tight italic serif">"{entry.summary}"</h4>

              <div className="bg-stone-50 p-4 rounded-2xl border-l-2 border-stone-800 mb-4 shadow-inner">
                <p className="text-stone-600 text-xs sm:text-sm italic leading-relaxed">"{entry.response}"</p>
              </div>

              <details className="mt-4 group/details">
                <summary className="text-[9px] text-stone-300 cursor-pointer uppercase tracking-widest font-bold hover:text-stone-500 transition-colors list-none flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[7px] transition-transform group-open/details:rotate-90"></i>
                  Full Transcript
                </summary>
                <p className="mt-4 text-xs sm:text-sm text-stone-500 leading-relaxed italic opacity-80 border-t border-stone-50 pt-4">{entry.transcript}</p>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchiveTimeline;

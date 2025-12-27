
import React from 'react';
import { CapsuleEntry } from '../types';

interface ArchiveTimelineProps {
  entries: CapsuleEntry[];
}

const ArchiveTimeline: React.FC<ArchiveTimelineProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400 opacity-50">
        <i className="fas fa-box-open text-6xl mb-4"></i>
        <p className="italic">Your archive is empty. Begin your story today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
      {entries.map((entry) => (
        <div key={entry.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-stone-200 group-[.is-active]:bg-stone-800 text-stone-500 group-[.is-active]:text-emerald-50 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500">
            <i className={`fas ${entry.mood === 'Stressed' ? 'fa-bolt' : entry.mood === 'Reflective' ? 'fa-leaf' : 'fa-sun'} text-[10px]`}></i>
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-3xl overflow-hidden border border-stone-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-stone-200 group-odd:text-right">
            {entry.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img 
                  src={entry.imageUrl} 
                  alt="Soul Card Metaphor" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] text-white/80 font-bold uppercase tracking-[0.3em]">Soul Card</span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 group-odd:flex-row-reverse">
                <time className="serif italic text-stone-400 text-sm">
                  {new Date(entry.timestamp).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
                <span className="px-3 py-1 bg-stone-800 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                  {entry.mood}
                </span>
              </div>
              
              <p className="text-stone-800 font-bold text-lg mb-3 leading-tight">
                "{entry.summary}"
              </p>
              
              <div className="bg-stone-50 p-4 rounded-2xl border-l-4 border-stone-800 mb-6 group-odd:border-l-0 group-odd:border-r-4 text-left group-odd:text-right">
                <p className="text-stone-600 text-sm italic leading-relaxed">
                  "{entry.response}"
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6 group-odd:justify-end">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-stone-400 border border-stone-100 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <details className="text-left group-odd:text-right">
                <summary className="text-[9px] text-stone-400 cursor-pointer hover:text-stone-800 transition-colors uppercase tracking-[0.2em] font-bold">Read Transcript</summary>
                <p className="mt-4 text-sm text-stone-500 leading-relaxed whitespace-pre-wrap font-medium">
                  {entry.transcript}
                </p>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchiveTimeline;

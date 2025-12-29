
import React, { useState, useMemo } from 'react';
import { askTheArchive } from '../services/geminiService';
import { CapsuleEntry, UserProfile } from '../types';
import CalendarView from './CalendarView';

interface ArchiveSearchProps {
  entries: CapsuleEntry[];
  profile: UserProfile;
  onFilterChange: (filteredEntries: CapsuleEntry[] | null) => void;
}

const ArchiveSearch: React.FC<ArchiveSearchProps> = ({ entries, profile, onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || entries.length === 0) return;

    setIsLoading(true);
    setAnswer(null);

    const historyText = entries
      .map(e => `[${new Date(e.timestamp).toLocaleDateString()}] ${e.transcript}`)
      .join('\n\n');

    const result = await askTheArchive(query, historyText, profile);
    setAnswer(result);
    setIsLoading(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    setSelectedDate(dateVal);

    if (!dateVal) {
      onFilterChange(null);
      return;
    }

    // Filter entries by date (Y-M-D)
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === dateVal;
    });

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setSelectedDate('');
    setQuery('');
    setAnswer(null);
    onFilterChange(null);
  };

  const handleCalendarSelect = (date: string | null) => {
    if (!date) {
      setSelectedDate('');
      onFilterChange(null);
      return;
    }

    setSelectedDate(date);
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === date;
    });
    onFilterChange(filtered);
  };

  return (
    <div className="space-y-4 mb-10">
      {/* Calendar View */}
      <CalendarView entries={entries} onDateSelect={handleCalendarSelect} />

      <div className="w-full glass-morphism p-5 sm:p-7 rounded-[2rem] border border-stone-200 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-800 text-white rounded-xl shadow-sm">
              <i className="fas fa-search text-xs"></i>
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-sm">Retrieve</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Search or Filter by Date</p>
            </div>
          </div>
          {(selectedDate || query || answer) && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1 rounded-lg transition-all"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Date Jump */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
              <i className="fas fa-calendar-day text-sm"></i>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full bg-white border border-stone-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm appearance-none"
            />
            {!selectedDate && (
              <div className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
                <span className="text-[10px] text-stone-300 font-bold uppercase tracking-widest">Jump to Date</span>
              </div>
            )}
          </div>

          <div className="relative flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-100"></div>
            <span className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.3em]">Or Ask AI</span>
            <div className="h-px flex-1 bg-stone-100"></div>
          </div>

          {/* AI Memory Search */}
          <form onSubmit={handleAISearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patterns..."
              className="flex-1 bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-xs text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-stone-800 text-white px-5 py-3.5 rounded-2xl hover:bg-stone-900 disabled:opacity-20 transition-all shadow-md active:scale-95"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic text-xs"></i>}
            </button>
          </form>
        </div>

        {answer && (
          <div className="mt-6 p-5 bg-stone-50 rounded-2xl border border-stone-200 animate-in fade-in slide-in-from-top-4 duration-500 relative">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-7 h-7 bg-stone-800 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <i className="fas fa-leaf text-[10px] text-emerald-400"></i>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed serif italic">
                {answer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveSearch;

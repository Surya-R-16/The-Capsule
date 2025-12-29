import React, { useState, useMemo } from 'react';
import { CapsuleEntry } from '../types';

interface CalendarViewProps {
    entries: CapsuleEntry[];
    onDateSelect: (date: string | null) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get entry dates as Set for O(1) lookup
    const entryDates = useMemo(() => {
        return new Set(entries.map(e => new Date(e.timestamp).toISOString().split('T')[0]));
    }, [entries]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and total days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate calendar days
    const days = useMemo(() => {
        const result = [];
        // Empty cells for days before first of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            result.push(null);
        }
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            result.push({
                day,
                dateStr,
                hasEntry: entryDates.has(dateStr),
                isToday: dateStr === new Date().toISOString().split('T')[0]
            });
        }
        return result;
    }, [year, month, firstDayOfMonth, daysInMonth, entryDates]);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-500"
                >
                    <i className="fas fa-chevron-left text-xs"></i>
                </button>
                <h3 className="font-bold text-stone-800 text-sm">
                    {monthNames[month]} {year}
                </h3>
                <button
                    onClick={goToNextMonth}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-500"
                >
                    <i className="fas fa-chevron-right text-xs"></i>
                </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-stone-400 uppercase">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((dayObj, i) => (
                    <div key={i} className="aspect-square flex items-center justify-center">
                        {dayObj ? (
                            <button
                                onClick={() => onDateSelect(dayObj.dateStr)}
                                className={`w-full h-full flex flex-col items-center justify-center rounded-lg text-xs transition-all relative
                  ${dayObj.isToday ? 'bg-stone-800 text-white' : 'hover:bg-stone-100'}
                  ${dayObj.hasEntry ? 'font-bold' : 'text-stone-400'}
                `}
                            >
                                {dayObj.day}
                                {dayObj.hasEntry && (
                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${dayObj.isToday ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                                )}
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>

            {/* Clear filter button */}
            <button
                onClick={() => onDateSelect(null)}
                className="mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-lg transition-all"
            >
                Show All Entries
            </button>
        </div>
    );
};

export default CalendarView;

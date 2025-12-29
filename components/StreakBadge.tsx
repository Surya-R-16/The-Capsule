import React, { useMemo } from 'react';
import { CapsuleEntry } from '../types';

interface StreakBadgeProps {
    entries: CapsuleEntry[];
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ entries }) => {
    const streak = useMemo(() => {
        if (entries.length === 0) return 0;

        // Get unique dates (YYYY-MM-DD) from entries
        const entryDates = new Set(
            entries.map(e => new Date(e.timestamp).toISOString().split('T')[0])
        );

        // Start from today and count backwards
        let count = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (entryDates.has(dateStr)) {
                count++;
            } else if (i > 0) {
                // Allow today to be missing (user might not have journaled yet today)
                break;
            }
        }

        return count;
    }, [entries]);

    if (streak === 0) return null;

    const getMessage = () => {
        if (streak >= 30) return 'Legendary!';
        if (streak >= 14) return 'On Fire!';
        if (streak >= 7) return 'Great Week!';
        if (streak >= 3) return 'Building Momentum';
        return 'Keep Going!';
    };

    return (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-2.5 py-1 rounded-full border border-amber-400/30">
            <span className="text-amber-400 text-sm">🔥</span>
            <span className="text-amber-300 text-xs font-bold">{streak}</span>
            <span className="text-amber-400/70 text-[9px] uppercase tracking-wider hidden sm:inline">
                {getMessage()}
            </span>
        </div>
    );
};

export default StreakBadge;

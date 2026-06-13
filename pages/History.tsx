import React, { useState } from 'react';
import { useHistoryStore } from '../src/store/useHistoryStore';
import { Search, ArrowUpDown, Clock, Activity, Target } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
    const { tests } = useHistoryStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<'date' | 'wpm' | 'accuracy'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: 'date' | 'wpm' | 'accuracy') => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const filteredTests = tests
        .filter(test => test.mode.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            return (a[sortKey] - b[sortKey]) * multiplier;
        });

    return (
        <div className="max-w-6xl mx-auto w-full px-4 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 text-[var(--accent-primary)] tracking-tight">Test History</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by mode..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                </div>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('date')}>
                                    <div className="flex items-center gap-2">Date <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4 font-semibold">Mode</th>
                                <th className="p-4 font-semibold cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('wpm')}>
                                    <div className="flex items-center gap-2">WPM <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4 font-semibold cursor-pointer hover:text-[var(--text-primary)]" onClick={() => handleSort('accuracy')}>
                                    <div className="flex items-center gap-2">Accuracy <ArrowUpDown size={14} /></div>
                                </th>
                                <th className="p-4 font-semibold">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--bg-tertiary)] text-[var(--text-primary)]">
                            {filteredTests.length > 0 ? (
                                filteredTests.map((test) => (
                                    <tr key={test.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium">{format(test.date, 'MMM d, yyyy')}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">{format(test.date, 'h:mm a')}</div>
                                        </td>
                                        <td className="p-4 capitalize">
                                            <span className="bg-[var(--bg-tertiary)] px-2 py-1 rounded text-xs font-semibold">{test.mode}</span>
                                        </td>
                                        <td className="p-4 font-black text-[var(--accent-primary)]">{test.wpm}</td>
                                        <td className="p-4 font-semibold text-[var(--text-correct)]">{test.accuracy.toFixed(1)}%</td>
                                        <td className="p-4 text-[var(--text-secondary)]">{test.duration.toFixed(0)}s</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">
                                        No tests found. Start practicing to build your history!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

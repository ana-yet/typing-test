import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TestResults } from '../types';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useHistoryStore } from '../src/store/useHistoryStore';

interface ResultsModalProps {
    results: TestResults;
    onRestart: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ results, onRestart }) => {
    const troubleKeys = Object.entries(results.missedChars || {})
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5);

    const { tests } = useHistoryStore();
    
    // tests[0] is current, tests[1] is previous
    const previousTest = tests.length > 1 ? tests[1] : null;

    const getDiffDisplay = (current: number, previous: number, isInverted = false) => {
        const diff = current - previous;
        if (diff === 0) return { component: <Minus size={14} className="text-[var(--text-secondary)]" />, color: 'text-[var(--text-secondary)]', text: '0' };
        
        const isBetter = isInverted ? diff < 0 : diff > 0;
        const color = isBetter ? 'text-[var(--text-correct)]' : 'text-[var(--bg-incorrect)]';
        const Icon = isBetter ? TrendingUp : TrendingDown;
        
        return { 
            component: <Icon size={14} className={color} />, 
            color, 
            text: `${diff > 0 ? '+' : ''}${typeof current === 'number' && current % 1 !== 0 ? diff.toFixed(1) : diff}` 
        };
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--bg-tertiary)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Test Complete</h2>
                    <button 
                        onClick={onRestart}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-primary)] text-[var(--text-primary-inverted)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors font-bold shadow-lg"
                    >
                        <RefreshCw size={18} />
                        Next Test
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[var(--bg-tertiary)] p-5 rounded-xl border border-[var(--bg-tertiary-hover)]">
                        <div className="text-sm text-[var(--text-secondary)] mb-1 font-medium">WPM</div>
                        <div className="text-4xl font-black text-[var(--accent-primary)]">{results.wpm}</div>
                        {previousTest && (
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium">
                                {getDiffDisplay(results.wpm, previousTest.wpm).component}
                                <span className={getDiffDisplay(results.wpm, previousTest.wpm).color}>
                                    {getDiffDisplay(results.wpm, previousTest.wpm).text} WPM
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-[var(--bg-tertiary)] p-5 rounded-xl border border-[var(--bg-tertiary-hover)]">
                        <div className="text-sm text-[var(--text-secondary)] mb-1 font-medium">Accuracy</div>
                        <div className="text-4xl font-black text-[var(--text-correct)]">{results.accuracy.toFixed(1)}%</div>
                        {previousTest && (
                            <div className="mt-2 flex items-center gap-1 text-sm font-medium">
                                {getDiffDisplay(results.accuracy, previousTest.accuracy).component}
                                <span className={getDiffDisplay(results.accuracy, previousTest.accuracy).color}>
                                    {getDiffDisplay(results.accuracy, previousTest.accuracy).text}%
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-[var(--bg-tertiary)] p-5 rounded-xl border border-[var(--bg-tertiary-hover)]">
                        <div className="text-sm text-[var(--text-secondary)] mb-1 font-medium">Raw WPM</div>
                        <div className="text-4xl font-black text-[var(--text-primary)]">{results.rawWpm}</div>
                    </div>
                    
                    <div className="bg-[var(--bg-tertiary)] p-5 rounded-xl border border-[var(--bg-tertiary-hover)]">
                        <div className="text-sm text-[var(--text-secondary)] mb-1 font-medium">Time</div>
                        <div className="text-4xl font-black text-[var(--text-primary)]">{results.time.toFixed(0)}s</div>
                    </div>
                </div>

                <div className="mb-8 bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--bg-tertiary-hover)] h-72">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 text-center">Performance Over Time</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" vertical={false} />
                            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" stroke="var(--accent-primary)" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="var(--text-correct)" tick={{ fill: 'var(--text-secondary)' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary-hover)', color: 'var(--text-primary)', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--accent-primary)" strokeWidth={3} dot={false} name="WPM" />
                            <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="var(--text-correct)" strokeWidth={3} dot={false} name="Accuracy %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {troubleKeys.length > 0 && (
                    <div className="bg-[var(--bg-tertiary)] p-5 rounded-xl border border-[var(--bg-tertiary-hover)]">
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">Trouble Keys</h3>
                        <div className="flex flex-wrap gap-4">
                            {troubleKeys.map(([char, count]) => (
                                <div key={char} className="flex flex-col items-center bg-[var(--bg-secondary)] px-5 py-3 rounded-lg border border-[var(--bg-incorrect)]/30 shadow-sm">
                                    <span className="text-2xl font-black text-[var(--text-primary)] mb-1">{char === ' ' ? '␣' : char}</span>
                                    <span className="text-xs font-semibold text-[var(--bg-incorrect)]">{count} misses</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsModal;
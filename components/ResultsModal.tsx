import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TestResults } from '../types';
import { RefreshCw } from 'lucide-react';

interface ResultsModalProps {
    results: TestResults;
    onRestart: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ results, onRestart }) => {
    const troubleKeys = Object.entries(results.missedChars || {})
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[var(--bg-secondary)] p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--bg-tertiary)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Test Complete</h2>
                    <button 
                        onClick={onRestart}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-secondary)] text-[var(--text-primary-inverted)] rounded-lg hover:bg-[var(--accent-secondary-hover)] transition-colors font-bold"
                    >
                        <RefreshCw size={18} />
                        Next Test
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
                        <div className="text-sm text-[var(--text-secondary)] mb-1">WPM</div>
                        <div className="text-4xl font-bold text-[var(--accent-primary)]">{results.wpm}</div>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
                        <div className="text-sm text-[var(--text-secondary)] mb-1">Accuracy</div>
                        <div className="text-4xl font-bold text-[var(--text-correct)]">{results.accuracy.toFixed(1)}%</div>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
                        <div className="text-sm text-[var(--text-secondary)] mb-1">Raw WPM</div>
                        <div className="text-4xl font-bold text-[var(--text-primary)]">{results.rawWpm}</div>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg text-center">
                        <div className="text-sm text-[var(--text-secondary)] mb-1">Time</div>
                        <div className="text-4xl font-bold text-[var(--text-primary)]">{results.time.toFixed(0)}s</div>
                    </div>
                </div>

                <div className="mb-8 bg-[var(--bg-tertiary)] p-4 rounded-lg h-64">
                    <h3 className="text-sm text-[var(--text-secondary)] mb-4 text-center">Performance Over Time</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary-hover)" />
                            <XAxis dataKey="time" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                            <YAxis yAxisId="left" stroke="var(--accent-primary)" tick={{ fill: 'var(--text-secondary)' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="var(--text-correct)" tick={{ fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="var(--accent-primary)" strokeWidth={3} dot={false} name="WPM" />
                            <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="var(--text-correct)" strokeWidth={3} dot={false} name="Accuracy %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {troubleKeys.length > 0 && (
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                        <h3 className="text-sm text-[var(--text-secondary)] mb-4">Trouble Keys</h3>
                        <div className="flex flex-wrap gap-4">
                            {troubleKeys.map(([char, count]) => (
                                <div key={char} className="flex flex-col items-center bg-[var(--bg-secondary)] px-4 py-2 rounded-md border border-[var(--bg-incorrect)]">
                                    <span className="text-2xl font-bold text-[var(--text-primary)] mb-1">{char === ' ' ? 'Space' : char}</span>
                                    <span className="text-xs text-[var(--bg-incorrect)]">{count} misses</span>
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
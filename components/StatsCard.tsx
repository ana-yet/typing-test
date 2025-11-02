
import React from 'react';

interface StatsCardProps {
    label: string;
    value: number | string;
    unit?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, unit }) => {
    return (
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-1">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--accent-primary)]">
                {value}
                {unit && <span className="text-base sm:text-lg ml-1">{unit}</span>}
            </p>
        </div>
    );
};

export default StatsCard;
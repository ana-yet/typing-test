
import React from 'react';

interface StatsCardProps {
    label: string;
    value: number | string;
    unit?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, unit }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-md text-center">
            <p className="text-sm text-slate-400 mb-1">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-sky-400">
                {value}
                {unit && <span className="text-base sm:text-lg ml-1">{unit}</span>}
            </p>
        </div>
    );
};

export default StatsCard;

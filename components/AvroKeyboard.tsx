import React from 'react';

interface KeyProps {
  en: string;
  bn: string;
  bnShift?: string;
  className?: string;
  active: boolean;
}

const Key: React.FC<KeyProps> = ({ en, bn, bnShift, className = '', active }) => {
  const baseClasses = "h-12 rounded-md flex flex-col items-center justify-center p-1 border-b-4 transition-all duration-75 font-sans";
  const dynamicClasses = active 
    ? "bg-[var(--accent-secondary)] border-[var(--accent-primary)] transform -translate-y-px" 
    : "bg-[var(--bg-tertiary)] border-[var(--border-key)] hover:bg-[var(--bg-tertiary-hover)]";
  
  return (
    <div className={`${baseClasses} ${dynamicClasses} ${className}`}>
      <span className="text-sm text-[var(--text-muted)] self-end px-1">{bnShift}</span>
      <span className="font-bold text-lg text-[var(--text-primary)] -mt-3">{en.toUpperCase()}</span>
      <span className="text-sm text-[var(--accent-primary-faded)] self-start px-1">{bn}</span>
    </div>
  );
};

const keyboardLayout = [
  [
    { en: '`', bn: '`', bnShift: '~' },
    { en: '1', bn: '১' }, { en: '2', bn: '২' }, { en: '3', bn: '৩' },
    { en: '4', bn: '৪', bnShift: '৳' }, { en: '5', bn: '৫' },
    { en: '6', bn: '৬', bnShift: 'ঁ' }, { en: '7', bn: '৭', bnShift: 'ৎ' },
    { en: '8', bn: '৮' }, { en: '9', bn: '৯' }, { en: '0', bn: '০' },
    { en: '-', bn: '-' }, { en: '=', bn: '=' },
    { en: 'Backspace', bn: 'মুছুন', className: 'col-span-2', bnShift:'' },
  ],
  [
    { en: 'Tab', bn: 'ট্যাব', className: 'col-span-2', bnShift:'' },
    { en: 'q', bn: '' }, { en: 'w', bn: 'w' },
    { en: 'e', bn: 'এ', bnShift: 'ঐ' }, { en: 'r', bn: 'র' },
    { en: 't', bn: 'ত', bnShift: 'ট' }, { en: 'y', bn: 'য়' },
    { en: 'u', bn: 'উ', bnShift: 'ঊ' }, { en: 'i', bn: 'ই', bnShift: 'ঈ' },
    { en: 'o', bn: 'ও', bnShift: 'ঔ' }, { en: 'p', bn: 'প' },
    { en: '[', bn: '[' }, { en: ']', bn: ']' },
    { en: '\\', bn: '\\', className: 'col-span-1' },
  ],
  [
    { en: 'CapsLock', bn: 'ক্যাপস', className: 'col-span-2', bnShift:'' },
    { en: 'a', bn: 'অ', bnShift: 'আ' }, { en: 's', bn: 'স', bnShift: 'ষ' },
    { en: 'd', bn: 'দ', bnShift: 'ড' }, { en: 'f', bn: 'ফ' },
    { en: 'g', bn: 'গ', bnShift: 'ঘ' }, { en: 'h', bn: 'হ' },
    { en: 'j', bn: 'জ', bnShift: 'ঝ' }, { en: 'k', bn: 'ক', bnShift: 'খ' },
    { en: 'l', bn: 'ল' }, { en: ';', bn: ';' }, { en: "'", bn: "'" },
    { en: 'Enter', bn: 'প্রবেশ', className: 'col-span-2', bnShift:'' },
  ],
  [
    { en: 'Shift', bn: 'শিফট', className: 'col-span-3', bnShift:'' },
    { en: 'z', bn: 'য' }, { en: 'x', bn: '' },
    { en: 'c', bn: 'চ', bnShift: 'ছ' }, { en: 'v', bn: 'ভ' },
    { en: 'b', bn: 'ব' }, { en: 'n', bn: 'ন', bnShift: 'ণ' },
    { en: 'm', bn: 'ম' }, { en: ',', bn: ',' },
    { en: '.', bn: '।', bnShift: '.' }, { en: '/', bn: '/' },
    { en: 'Shift', bn: 'শিফট', className: 'col-span-2', bnShift:'' },
  ],
  [
    { en: ' ', bn: 'স্পেস', className: 'col-span-12', bnShift:'' }
  ]
];


const AvroKeyboard: React.FC<{ activeKey: string; onClose: () => void }> = ({ activeKey, onClose }) => {
    return (
        <div className="w-full max-w-4xl mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[var(--text-secondary)]">Avro Phonetic Chart</h2>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                    aria-label="Close chart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-15 gap-2">
                        {row.map((key, keyIndex) => (
                            <Key 
                                key={keyIndex}
                                {...key}
                                active={activeKey.toLowerCase() === key.en.toLowerCase()}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvroKeyboard;
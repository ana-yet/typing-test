import React from 'react';

interface KeyProps {
  en: string;
  bn: string;
  bnShift?: string;
  className?: string;
  active: boolean;
}

const Key: React.FC<KeyProps> = ({ en, bn, bnShift, className = '', active }) => {
  const baseClasses = "h-12 rounded-md flex flex-col items-center justify-center p-1 border-b-4 transition-all duration-75";
  const activeClasses = active ? "bg-sky-500 border-sky-300 transform -translate-y-px" : "bg-slate-700 border-slate-900 hover:bg-slate-600";
  
  return (
    <div className={`${baseClasses} ${activeClasses} ${className}`}>
      <span className="text-sm text-slate-300">{bnShift || bn}</span>
      <span className="font-sans font-bold text-lg text-white">{en.toUpperCase()}</span>
    </div>
  );
};

const keyboardLayout = [
  [
    { en: '`', bn: '`', bnShift: '~' },
    { en: '1', bn: '১' },
    { en: '2', bn: '২' },
    { en: '3', bn: '৩' },
    { en: '4', bn: '৪', bnShift: '৳' },
    { en: '5', bn: '৫' },
    { en: '6', bn: '৬', bnShift: 'ঁ' },
    { en: '7', bn: '৭' },
    { en: '8', bn: '৮' },
    { en: '9', bn: '৯' },
    { en: '0', bn: '০' },
    { en: '-', bn: '-' },
    { en: '=', bn: '=' },
    { en: 'Backspace', bn: 'মুছুন', className: 'col-span-2' },
  ],
  [
    { en: 'Tab', bn: 'ট্যাব', className: 'col-span-2' },
    { en: 'q', bn: 'q' },
    { en: 'w', bn: 'w' },
    { en: 'e', bn: 'ই', bnShift: 'ঈ' },
    { en: 'r', bn: 'র' },
    { en: 't', bn: 'ত', bnShift: 'ট' },
    { en: 'y', bn: 'য়' },
    { en: 'u', bn: 'উ', bnShift: 'ঊ' },
    { en: 'i', bn: 'ই', bnShift: 'ঈ' },
    { en: 'o', bn: 'ও', bnShift: 'ঔ' },
    { en: 'p', bn: 'প' },
    { en: '[', bn: '[' },
    { en: ']', bn: ']' },
    { en: '\\', bn: '\\', className: 'col-span-1' },
  ],
  [
    { en: 'CapsLock', bn: 'ক্যাপস', className: 'col-span-2' },
    { en: 'a', bn: 'অ', bnShift: 'আ' },
    { en: 's', bn: 'স', bnShift: 'ষ' },
    { en: 'd', bn: 'দ', bnShift: 'ড' },
    { en: 'f', bn: 'ফ' },
    { en: 'g', bn: 'গ' },
    { en: 'h', bn: 'হ' },
    { en: 'j', bn: 'জ', bnShift: 'ঝ' },
    { en: 'k', bn: 'ক' },
    { en: 'l', bn: 'ল' },
    { en: ';', bn: ';' },
    { en: "'", bn: "'" },
    { en: 'Enter', bn: 'প্রবেশ', className: 'col-span-2' },
  ],
  [
    { en: 'Shift', bn: 'শিফট', className: 'col-span-3' },
    { en: 'z', bn: 'য' },
    { en: 'x', bn: 'x' },
    { en: 'c', bn: 'চ' },
    { en: 'v', bn: 'ভ' },
    { en: 'b', bn: 'ব' },
    { en: 'n', bn: 'ন', bnShift: 'ণ' },
    { en: 'm', bn: 'ম' },
    { en: ',', bn: ',' },
    { en: '.', bn: '।', bnShift: '.' },
    { en: '/', bn: '/' },
    { en: 'Shift', bn: 'শিফট', className: 'col-span-2' },
  ],
  [
    { en: ' ', bn: 'স্পেস', className: 'col-span-12' }
  ]
];


const AvroKeyboard: React.FC<{ activeKey: string }> = ({ activeKey }) => {
    return (
        <div className="w-full max-w-4xl mt-8 p-4 bg-slate-800 rounded-lg shadow-lg">
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

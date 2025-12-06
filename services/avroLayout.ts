
// Comprehensive Avro Phonetic Layout Map
// Prioritizes longest matches first (e.g. 'kkh' before 'k')

interface PhoneticPattern {
    type: 'vowel' | 'consonant' | 'other';
    value: string;
    kar?: string;
}

const patterns: Record<string, PhoneticPattern> = {
    // Vowels
    'a':   { type: 'vowel', value: 'অ', kar: '' },
    'A':   { type: 'vowel', value: 'আ', kar: 'া' },
    'i':   { type: 'vowel', value: 'ই', kar: 'ি' },
    'I':   { type: 'vowel', value: 'ঈ', kar: 'ী' },
    'u':   { type: 'vowel', value: 'উ', kar: 'ু' },
    'U':   { type: 'vowel', value: 'ঊ', kar: 'ূ' },
    'oo':  { type: 'vowel', value: 'ঊ', kar: 'ূ' },
    'rri': { type: 'vowel', value: 'ঋ', kar: 'ৃ' },
    'e':   { type: 'vowel', value: 'এ', kar: 'ে' },
    'E':   { type: 'vowel', value: 'ঐ', kar: 'ৈ' },
    'OI':  { type: 'vowel', value: 'ঐ', kar: 'ৈ' },
    'o':   { type: 'vowel', value: 'ও', kar: 'ো' },
    'O':   { type: 'vowel', value: 'ঔ', kar: 'ৌ' },
    'OU':  { type: 'vowel', value: 'ঔ', kar: 'ৌ' },

    // Consonants
    'k':   { type: 'consonant', value: 'ক' },
    'K':   { type: 'consonant', value: 'খ' },
    'kh':  { type: 'consonant', value: 'খ' },
    'g':   { type: 'consonant', value: 'গ' },
    'G':   { type: 'consonant', value: 'ঘ' },
    'gh':  { type: 'consonant', value: 'ঘ' },
    'Ng':  { type: 'consonant', value: 'ঙ' },
    
    'c':   { type: 'consonant', value: 'চ' },
    'ch':  { type: 'consonant', value: 'ছ' },
    'C':   { type: 'consonant', value: 'ছ' },
    'j':   { type: 'consonant', value: 'জ' },
    'J':   { type: 'consonant', value: 'ঝ' },
    'jh':  { type: 'consonant', value: 'ঝ' },
    'NG':  { type: 'consonant', value: 'ঞ' },
    
    'T':   { type: 'consonant', value: 'ট' },
    'Th':  { type: 'consonant', value: 'ঠ' },
    'D':   { type: 'consonant', value: 'ড' },
    'Dh':  { type: 'consonant', value: 'ঢ' },
    'N':   { type: 'consonant', value: 'ণ' },
    
    't':   { type: 'consonant', value: 'ত' },
    'th':  { type: 'consonant', value: 'থ' },
    'd':   { type: 'consonant', value: 'দ' },
    'dh':  { type: 'consonant', value: 'ধ' },
    'n':   { type: 'consonant', value: 'ন' },
    
    'p':   { type: 'consonant', value: 'প' },
    'P':   { type: 'consonant', value: 'ফ' },
    'f':   { type: 'consonant', value: 'ফ' },
    'ph':  { type: 'consonant', value: 'ফ' },
    'b':   { type: 'consonant', value: 'ব' },
    'B':   { type: 'consonant', value: 'ভ' },
    'bh':  { type: 'consonant', value: 'ভ' },
    'v':   { type: 'consonant', value: 'ভ' },
    'm':   { type: 'consonant', value: 'ম' },
    
    'z':   { type: 'consonant', value: 'য' },
    'y':   { type: 'consonant', value: 'য়' },
    'r':   { type: 'consonant', value: 'র' },
    'l':   { type: 'consonant', value: 'ল' },
    'L':   { type: 'consonant', value: 'ল' },
    
    'sh':  { type: 'consonant', value: 'শ' },
    'S':   { type: 'consonant', value: 'ষ' },
    's':   { type: 'consonant', value: 'স' },
    
    'h':   { type: 'consonant', value: 'হ' },
    'H':   { type: 'consonant', value: 'হ' },
    
    'R':   { type: 'consonant', value: 'ড়' },
    'Rh':  { type: 'consonant', value: 'ঢ়' },
    
    // Complex Conjunct Shortcuts
    'kkh': { type: 'consonant', value: 'ক্ষ' },
    
    // Symbols & Special
    'x':   { type: 'consonant', value: 'ক্স' },
    'ng':  { type: 'other', value: 'ং' },
    ':':   { type: 'other', value: 'ঃ' },
    '^':   { type: 'other', value: 'ঁ' },
    't`':  { type: 'other', value: 'ৎ' },
    '$':   { type: 'other', value: '৳' },
    '.':   { type: 'other', value: '।' },
    '..':  { type: 'other', value: '.' },
};

const modifiers: Record<string, string> = {
    'y': '্য', // Jofola
    'Z': '্য', // Jofola (explicit)
    'w': '্ব', // Bofola
};

// Sort keys by length descending (crucial for 'kkh' matching before 'k')
const sortedKeys = Object.keys(patterns).sort((a, b) => b.length - a.length);

export function translate(text: string): string {
    let result = '';
    let lastType: 'vowel' | 'consonant' | 'other' | null = null;

    for (let i = 0; i < text.length; ) {
        let match: PhoneticPattern | null = null;
        let matchKey = '';

        // 1. Find Longest Matching Pattern
        for (const key of sortedKeys) {
            if (text.startsWith(key, i)) {
                match = patterns[key];
                matchKey = key;
                break;
            }
        }
        
        // 2. Handle No Match (Unknown chars or Modifiers not in patterns like 'Z')
        if (!match) {
            const char = text[i];
            
            // Check if it's a modifier key acting on a consonant
            if (lastType === 'consonant' && modifiers[char]) {
                result += modifiers[char];
                lastType = 'consonant'; // Stays consonant to allow subsequent vowel kars
            } else {
                result += char;
                lastType = 'other';
            }
            i++;
            continue;
        }

        // 3. Handle Pattern Matches
        
        // Special check: even if 'y' or 'w' match a consonant pattern, 
        // if they follow a consonant, they might act as Jofola/Bofola modifiers.
        // The `modifiers` map takes precedence for these keys in this context.
        if (lastType === 'consonant' && modifiers[matchKey]) {
            result += modifiers[matchKey];
            lastType = 'consonant'; 
            i += matchKey.length;
            continue;
        }

        if (match.type === 'vowel') {
            if (lastType === 'consonant') {
                // Apply Kar
                result += match.kar || '';
                // The vowel sign ends the consonant cluster logic
                lastType = 'vowel';
            } else {
                // Independent Vowel
                result += match.value;
                lastType = 'vowel';
            }
        } else if (match.type === 'consonant') {
            if (lastType === 'consonant') {
                // Auto-Conjunct: Add Hasanto
                result += '্';
            }
            result += match.value;
            lastType = 'consonant';
        } else {
            // Other (Punctuation, Symbols)
            result += match.value;
            lastType = 'other';
        }

        i += matchKey.length;
    }

    return result;
}

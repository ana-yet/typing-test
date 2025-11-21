
// Comprehensive Avro Phonetic Layout Map
// Prioritizes longest matches first (e.g. 'kh' before 'k')

interface PhoneticPattern {
    type: 'vowel' | 'consonant' | 'other';
    value: string;
    kar?: string; // For vowels: the vowel sign form
}

const patterns: Record<string, PhoneticPattern> = {
    // Vowels
    'a': { type: 'vowel', value: 'অ', kar: '' }, // 'a' as kar deletes implied hasanto but adds no visual sign (inherent vowel)
    'A': { type: 'vowel', value: 'আ', kar: 'া' },
    'i': { type: 'vowel', value: 'ই', kar: 'ি' },
    'I': { type: 'vowel', value: 'ঈ', kar: 'ী' },
    'u': { type: 'vowel', value: 'উ', kar: 'ু' },
    'U': { type: 'vowel', value: 'ঊ', kar: 'ূ' },
    'rri': { type: 'vowel', value: 'ঋ', kar: 'ৃ' },
    'e': { type: 'vowel', value: 'এ', kar: 'ে' },
    'E': { type: 'vowel', value: 'ঐ', kar: 'ৈ' },
    'o': { type: 'vowel', value: 'ও', kar: 'ো' },
    'O': { type: 'vowel', value: 'ঔ', kar: 'ৌ' },

    // Consonants - Gutturals
    'k': { type: 'consonant', value: 'ক' },
    'K': { type: 'consonant', value: 'খ' },
    'kh': { type: 'consonant', value: 'খ' },
    'g': { type: 'consonant', value: 'গ' },
    'G': { type: 'consonant', value: 'ঘ' },
    'gh': { type: 'consonant', value: 'ঘ' },
    'Ng': { type: 'consonant', value: 'ঙ' },

    // Consonants - Palatals
    'c': { type: 'consonant', value: 'চ' },
    'C': { type: 'consonant', value: 'ছ' },
    'ch': { type: 'consonant', value: 'ছ' },
    'j': { type: 'consonant', value: 'জ' },
    'J': { type: 'consonant', value: 'ঝ' },
    'jh': { type: 'consonant', value: 'ঝ' },
    'NG': { type: 'consonant', value: 'ঞ' },

    // Consonants - Cerebrals
    'T': { type: 'consonant', value: 'ট' },
    'Th': { type: 'consonant', value: 'ঠ' },
    'D': { type: 'consonant', value: 'ড' },
    'Dh': { type: 'consonant', value: 'ঢ' },
    'N': { type: 'consonant', value: 'ণ' },

    // Consonants - Dentals
    't': { type: 'consonant', value: 'ত' },
    'th': { type: 'consonant', value: 'থ' },
    'd': { type: 'consonant', value: 'দ' },
    'dh': { type: 'consonant', value: 'ধ' },
    'n': { type: 'consonant', value: 'ন' },

    // Consonants - Labials
    'p': { type: 'consonant', value: 'প' },
    'P': { type: 'consonant', value: 'ফ' },
    'f': { type: 'consonant', value: 'ফ' },
    'ph': { type: 'consonant', value: 'ফ' },
    'b': { type: 'consonant', value: 'ব' },
    'B': { type: 'consonant', value: 'ভ' },
    'bh': { type: 'consonant', value: 'ভ' },
    'v': { type: 'consonant', value: 'ভ' },
    'm': { type: 'consonant', value: 'ম' },

    // Consonants - Others
    'z': { type: 'consonant', value: 'য' },
    'r': { type: 'consonant', value: 'র' },
    'l': { type: 'consonant', value: 'ল' },
    'L': { type: 'consonant', value: 'ল' },
    'sh': { type: 'consonant', value: 'শ' },
    'S': { type: 'consonant', value: 'ষ' },
    's': { type: 'consonant', value: 'স' },
    'h': { type: 'consonant', value: 'হ' },
    'H': { type: 'consonant', value: 'হ' },
    'R': { type: 'consonant', value: 'ড়' },
    'Rh': { type: 'consonant', value: 'ঢ়' },
    'y': { type: 'consonant', value: 'য়' },
    
    // Special combinations
    'x': { type: 'consonant', value: 'ক্স' }, // Treated as consonant cluster k+s
    'ng': { type: 'other', value: 'ং' },
    't`': { type: 'other', value: 'ৎ' }, // Khanda Ta
    '$': { type: 'other', value: '৳' },
    ':': { type: 'other', value: 'ঃ' },
    '^': { type: 'other', value: 'ঁ' },
    '.': { type: 'other', value: '।' },
    '..': { type: 'other', value: '.' },
};

// Modifiers applied if preceding char was a consonant
const modifiers: Record<string, string> = {
    'y': '্য', // Jofola
    'Z': '্য', // Jofola
    'w': '্ব', // Bofola
    '`': '', // delete prev? No, usually handled by lookahead or ignored.
};

// Sort keys by length descending to ensure 'kh' is matched before 'k'
const sortedKeys = Object.keys(patterns).sort((a, b) => b.length - a.length);

export function translate(text: string): string {
    let result = '';
    let lastType: 'vowel' | 'consonant' | 'other' | null = null;

    for (let i = 0; i < text.length; ) {
        let match: PhoneticPattern | null = null;
        let matchKey = '';

        // 1. Find the longest matching pattern from current position
        for (const key of sortedKeys) {
            if (text.startsWith(key, i)) {
                match = patterns[key];
                matchKey = key;
                break;
            }
        }

        // 2. Handle non-matches (unknown chars)
        if (!match) {
            // Check for modifiers that might not be in strict patterns list (like 'w')
            // or if it's a modifier key like 'y' acting as Jofola
            const char = text[i];
            if (lastType === 'consonant' && modifiers[char]) {
                result += modifiers[char];
                // Modifiers like Jofola/Bofola generally act as part of the consonant cluster,
                // effectively keeping the state as 'consonant' so next vowel becomes a Kar.
                lastType = 'consonant'; 
            } else {
                 // If explicit mapping not found, pass through
                 // However, check for 'w' explicitly if not in patterns
                 if (lastType === 'consonant' && char === 'w') {
                     result += modifiers['w'];
                     lastType = 'consonant';
                 } else {
                     result += char;
                     lastType = 'other';
                 }
            }
            i++;
            continue;
        }

        // 3. Handle Pattern Matches
        
        // Special check for Modifiers (like 'y' which is both য় and Jofola)
        if (lastType === 'consonant' && modifiers[matchKey]) {
             result += modifiers[matchKey];
             lastType = 'consonant';
             i += matchKey.length;
             continue;
        }

        if (match.type === 'vowel') {
            if (lastType === 'consonant') {
                // Consonant + Vowel = Consonant + Vowel Sign (Kar)
                // 'a' has empty string kar, effectively removing the inherent 'hasanto' conceptually, 
                // but in this logic, we add 'hasanto' aggressively between consonants, 
                // so 'a' effectively just stops the hasanto addition for the next char.
                result += match.kar || ''; 
                
                // After a vowel sign, the syllable is complete.
                lastType = 'vowel';
            } else {
                // Vowel + Vowel or Start + Vowel = Full Vowel
                result += match.value;
                lastType = 'vowel';
            }
        } else if (match.type === 'consonant') {
            if (lastType === 'consonant') {
                // Consonant + Consonant = Conjunct
                // We insert a Hasanto between them.
                result += '্';
            }
            result += match.value;
            lastType = 'consonant';
        } else {
            // Other symbols (numbers, punctuation matched in patterns)
            result += match.value;
            lastType = 'other';
        }

        i += matchKey.length;
    }

    return result;
}

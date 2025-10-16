// A simplified implementation of the Avro phonetic layout.
// This handles most common cases including vowels, consonants, and basic conjuncts.
// Note: Perfect phonetic translation is complex; this covers the essentials for a typing test.

const VOWELS = "aeiouAEIOU";
const isVowel = (char: string) => VOWELS.includes(char);

const consonants = "kgcjTṭdDḍhṇNtpdbmnrlshSḻ".split("");
const isBengaliConsonant = (char: string) => consonants.includes(char);

const maps = {
    // Vowels
    'a': 'অ', 'A': 'আ', 'i': 'ই', 'I': 'ঈ', 'u': 'উ', 'U': 'ঊ',
    'e': 'এ', 'E': 'ঐ', 'o': 'ও', 'O': 'ঔ',
    // Consonants (single char)
    'k': 'ক', 'g': 'গ', 'c': 'চ', 'j': 'জ', 'T': 'ট', 'D': 'ড', 'N': 'ণ', 't': 'ত', 'd': 'দ',
    'n': 'ন', 'p': 'প', 'f': 'ফ', 'b': 'ব', 'v': 'ভ', 'm': 'ম', 'z': 'য', 'r': 'র',
    'l': 'ল', 's': 'স', 'S': 'ষ', 'h': 'হ', 'R': 'ড়', 'y': 'য়',
    // Consonants (multi-char)
    'kh': 'খ', 'gh': 'ঘ', 'Ng': 'ঙ', 'ch': 'ছ', 'jh': 'ঝ', 'NG': 'ঞ', 'Th': 'ঠ', 'Dh': 'ঢ',
    'th': 'থ', 'dh': 'ধ', 'ph': 'ফ', 'bh': 'ভ', 'sh': 'শ', 'Rh': 'ঢ়',
    // Special Characters
    'ng': 'ং',
    '^': 'ঁ',
    ':': 'ঃ',
    '.': '।',
    '$': '৳',
};

const karMap = {
    'a': 'া', 'A': 'া', 'i': 'ি', 'I': 'ী', 'u': 'ু', 'U': 'ূ', 'e': 'ে',
    'E': 'ৈ', 'o': 'ো', 'O': 'ৌ', 'r': '্র', 'ri': 'ৃ'
};

const folaMap = {
    'w': '্ব', // b-fola
    'y': '্য', // j-fola
    'Z': '্য', // j-fola
    'r': '্র'  // r-fola
}

export function translate(text: string): string {
    let result = '';
    let lastCharWasConsonant = false;
    let lastCharWasHosonto = false;
    let previousBengaliChar = '';

    for (let i = 0; i < text.length; i++) {
        let processed = false;
        
        // Lookahead for 3-char sequences like 'rri'
        if (i + 2 < text.length) {
            const threeChar = text.substring(i, i + 3);
            if (threeChar === 'rri') {
                result += 'ঋ';
                i += 2;
                processed = true;
                lastCharWasConsonant = false;
                lastCharWasHosonto = false;
            }
        }
        
        // Lookahead for 2-char sequences
        if (!processed && i + 1 < text.length) {
            const twoChar = text.substring(i, i + 2);
            if (maps[twoChar]) {
                result += maps[twoChar];
                i += 1;
                processed = true;
                lastCharWasConsonant = true;
                lastCharWasHosonto = false;
            } else if (karMap[twoChar]) { // for 'ri' kar
                 result += karMap[twoChar];
                 i += 1;
                 processed = true;
                 lastCharWasConsonant = false;
                 lastCharWasHosonto = false;
            }
        }
        
        // Process single characters
        if (!processed) {
            const char = text[i];
            
            if (isVowel(char)) {
                if (lastCharWasConsonant) {
                    result += karMap[char];
                } else {
                    result += maps[char];
                }
                lastCharWasConsonant = false;
                lastCharWasHosonto = false;
            } else if (maps[char]) {
                result += maps[char];
                lastCharWasConsonant = true;
                lastCharWasHosonto = false;
            } else if (char === 'h') {
                if (lastCharWasConsonant) {
                    result += '্';
                    lastCharWasHosonto = true;
                } else {
                    result += 'হ'; // 'h' at the beginning or after a vowel
                    lastCharWasConsonant = true;
                    lastCharWasHosonto = false;
                }
            } else if (folaMap[char] && lastCharWasConsonant) {
                 result += folaMap[char];
                 lastCharWasConsonant = true; // a fola forms part of a consonant cluster
                 lastCharWasHosonto = false;
            }
            else {
                // For numbers, symbols, or unmapped chars
                result += char;
                lastCharWasConsonant = false;
                lastCharWasHosonto = false;
            }
        }
         previousBengaliChar = result.slice(-1);
    }
    
    // Automatic vowel for trailing hosonto, e.g. "k" becomes "ক" not "ক্"
    if (result.endsWith('্')) {
        result = result.slice(0, -1) + 'অ';
    }

    return result;
}

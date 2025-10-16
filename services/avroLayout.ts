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
    'k': 'ক', 'K': 'খ', 'g': 'গ', 'G': 'ঘ', 'c': 'চ', 'C': 'ছ', 'j': 'জ', 'J': 'ঝ', 
    'T': 'ট', 'Th': 'ঠ', 'D': 'ড', 'Dh': 'ঢ', 'N': 'ণ', 't': 'ত', 'th': 'থ', 'd': 'দ', 'dh': 'ধ',
    'n': 'ন', 'p': 'প', 'ph': 'ফ', 'f': 'ফ', 'b': 'ব', 'bh': 'ভ', 'v': 'ভ', 'm': 'ম', 'z': 'য', 'r': 'র',
    'l': 'ল', 's': 'স', 'S': 'ষ', 'sh': 'শ', 'h': 'হ', 'R': 'ড়', 'Rh': 'ঢ়','y': 'য়',
    // Consonants (multi-char)
    'kh': 'খ', 'gh': 'ঘ', 'Ng': 'ঙ', 'ch': 'ছ', 'jh': 'ঝ', 'NG': 'ঞ',
    // Special Characters
    'ng': 'ং',
    '^': 'ঁ',
    ':': 'ঃ',
    '.': '।',
    '$': '৳',
};

const karMap = {
    'a': '', 'A': 'া', 'i': 'ি', 'I': 'ী', 'u': 'ু', 'U': 'ূ', 'e': 'ে',
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

    for (let i = 0; i < text.length; i++) {
        let processed = false;
        
        // Lookahead for 3-char sequences like 'rri'
        if (i + 2 < text.length) {
            const threeChar = text.substring(i, i + 3).toLowerCase();
            if (threeChar === 'rri') {
                result += (lastCharWasConsonant ? 'ৃ' : 'ঋ');
                i += 2;
                processed = true;
                lastCharWasConsonant = false;
            }
        }
        
        // Lookahead for 2-char sequences
        if (!processed && i + 1 < text.length) {
            const twoChar = text.substring(i, i + 2);
            if (maps[twoChar]) {
                if (lastCharWasConsonant) result += '্';
                result += maps[twoChar];
                i += 1;
                processed = true;
                lastCharWasConsonant = true;
            } else if (karMap[twoChar.toLowerCase()]) { // for 'ri' kar
                 result += karMap[twoChar.toLowerCase()];
                 i += 1;
                 processed = true;
                 lastCharWasConsonant = false;
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
            } else if (maps[char]) {
                if(lastCharWasConsonant) result += '্';
                result += maps[char];
                lastCharWasConsonant = true;
            } else if (char === 'h' || char === 'H') {
                if (lastCharWasConsonant) {
                    // This is a hosonto, indicating a conjunct
                    // The logic for two-char like 'kh' already handles this
                    // so we just add the hosonto here.
                    result += '্';
                } else {
                    result += 'হ'; // 'h' at the beginning or after a vowel
                    lastCharWasConsonant = true;
                }
            } else if (folaMap[char] && lastCharWasConsonant) {
                 result += folaMap[char];
                 lastCharWasConsonant = true; // a fola forms part of a consonant cluster
            } else {
                // For numbers, symbols, or unmapped chars
                result += char;
                lastCharWasConsonant = false;
            }
        }
    }
    
    // Automatic vowel 'o' for trailing hosonto, e.g. "k" becomes "ক" not "ক্"
    if (result.endsWith('্')) {
        result = result.slice(0, -1);
    }

    return result;
}
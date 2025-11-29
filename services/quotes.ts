
export interface Quote {
    text: string;
    author: string;
}

export const quotes: Quote[] = [
    { text: "The art of writing is the art of discovering what you believe.", author: "Gustave Flaubert" },
    { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "The scariest moment is always just before you start.", author: "Stephen King" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Focus on the process, not the outcome.", author: "Unknown" },
    { text: "Speed is useful only if you are running in the right direction.", author: "Joel Barker" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

export const getRandomQuote = (): Quote => {
    return quotes[Math.floor(Math.random() * quotes.length)];
};

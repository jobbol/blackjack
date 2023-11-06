type rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type suit = 'H' | 'D' | 'S' | 'C';

interface cardObject {
    rank: string,
    suit:  string
}




export default class Blackjack {
    
}


export class Deck {
    deck: Card[];

    constructor () {
        this.deck = [];
        for (const suit of [...'HDSC']) {
            for (const rank of [...'23456789','10',...'JQKA']) {
                this.deck.push(new Card({suit, rank}));
            }
        }
    }

    shuffle () {

    }
}





export class Card {
    rank: string;
    suit: string;

    constructor (get: cardObject) {
        if (!get) {
            throw new Error('Card constructor must be called as new Card({suit, rank})');
        }
        this.rank = get.rank;
        this.suit = get.suit;
    }

    /**
     * Checks if a card has a valid rank and suit.
     * @returns {boolean}
     */
    validate () {

    }

    /**
     * Get the value of a card.  Aces are always returned as 11 and not 1.
     * @returns {number}
     */
    toValue (): number {
        let faces = ['J', 'Q', 'K', 'A'].some(r => r === this.rank);

        if (faces) {
            return 10;
        }

        let value = parseInt(this.rank);

        if (value) {
            return value;
        }
        
        throw new Error(`Could not get value from card rank of ${this.rank}.`);
    }

    /**
     * Convert this card object into a string.
     * @param {boolean} [long=false] - If true, the string returned is long format
     * @returns {string}
     * @example
     * card.toString();
     * // => A♦
     * @example
     * card.toString(true);
     * // => Ace of Diamonds
     */
    toString (long: boolean = false): string {
        const suitsShort = {
            'D': '♦',
            'H': '♥',
            'S': '♠',
            'C': '♣'
        }
        const suitsLong = {
            'D': 'Diamonds',
            'H': 'Hearts',
            'S': 'Spades',
            'C': 'Clubs'
        }
        const faces = {
            'A': 'Ace',
            'K': 'King',
            'Q': 'Queen',
            'J': 'Jack'
        }

        if (!long) {
            return suitsShort[this.suit as suit] + this.rank;
        }

        const rank = faces[this.rank as keyof typeof faces] ?? this.rank;
        const suit = suitsLong[this.suit as suit];
        return `${rank} of ${suit}`;
    }

    /**
     * Gets the color of the suit, either black or red.
     * @returns {string}
     */
    color (): string {
        if(['D', 'H'].includes(this.rank)) {
            return 'red';
        }
        return 'black';
    }
}





type rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type suit = 'H' | 'D' | 'S' | 'C';

interface cardObject {
    rank: string,
    suit:  string
}

const bustAmount = 22;



export default class Blackjack {
    deck: Deck;
    users: Card[][];
    hasDealer: boolean;

    /**
     * Starts a new game of Blackjack.
     * @param {number} [userCount=2] - The number of users in the game. Deal counts as user.
     * @param {boolean} [hasDealer=2] - If true the dealer is playing a hand as well.
     * Dealer will always be userIndex 0.  Players will start at index 1.
     */
    constructor ({userCount = 2, hasDealer = true}: {userCount: number, hasDealer: boolean}) {
        this.hasDealer = hasDealer;
        this.deck = new Deck();
        this.deck.shuffle();
        this.users = [...Array(userCount)].map(() => this.deck.remove(2));
    }

    /**
     * Gives a specified user a card.  Returns user's new hand.
     * @param {number} userIndex
     * @returns {Card[]}
     */
    hit (userIndex: number): Card[] {
        this.users[userIndex].push(...this.deck.remove());
        return this.users[userIndex];
    }

    /**
     * Causes the dealer to hit or stay.
     * 
     * @typedef {Object} dealerAction
     * @property {string} action - The action the dealer took: 'hit' or 'stay'.
     * @property {Card[]} hand - Array of cards the dealer currently has.
     * 
     * @returns {dealerAction} where action is the action the dealer has taken, and hand is the dealer's current hand.
     */
    dealerAction () {
       if (!this.hasDealer) {
        throw new Error('blackjack.dealerAction() cannot be called, if no dealer exists in the game.');
       }

       //Dealer hits on 16 and below and stands on 17 and above.
        if (this.getUserScore(0) < 16) {
            return {action: 'hit',  hand: this.hit(0)};
        } else {
            return {action: 'stay', hand: this.users[0]};
        }
    }

    /**
     * Gets the total score of a specified user.
     * @param {number} userIndex
     * @returns {number}
     */
    getUserScore (userIndex: number) {
        let score = this.users[userIndex].reduce((total, card) => total += card.toValue(), 0);

        //Scores that aren't busted don't need to be checked.
        if (score < bustAmount) {
            return score;
        }

        //If the dealer has busted, return their score.
        if (this.hasDealer && userIndex === 0) {
            return score;
        }

        //If a player has busted, attempt to reduce score if they have aces.
        let aces = this.users[userIndex].filter(card => card.rank === 'A').length;
        while (score >= bustAmount && aces > 0) {
            aces--;
            score-=10;
        }
        return score;
    }


    /**
     * Ends the current game.  Returns the winner and scores.
     * For a new game, create a new Blackjack object.
     * @typedef  {object} endStats
     * @property {number[]} scores      - array of user scores.
     * @property {number}   winnerIndex - index of the winning user.
     * @property {boolean}  isTied      - true if there's a tie.
     * @property {number[]} tiedUsers   - array of user indexes who have tied.
     * @property {boolean}  isDealerDefaultWin - If the dealer won by default for all players busting.
     * 
     * @returns {endStats}
     */
    end () {
        Object.freeze(this.users);
        let scores = this.users.map((_undefined, i) => this.getUserScore(i));

        let isTied = false;
        let isDealerDefaultWin = false;
        let tiedUsers: number[] = [];
        let winnerIndex = -1;
        let winnerScore = 0;

        scores.forEach((score, index) => {
            //If this score isn't a bust and is the lowest, then make this the winner and reset possible ties.
            if (score < bustAmount && score > winnerScore) {
                winnerIndex = index;
                isTied = false;
                tiedUsers = [];
            }

            //If this score is the equal to the winning score, then this is a tie.  Reset winner.
            if (score < bustAmount && score === winnerScore) {
                winnerIndex = -1;
                if (tiedUsers.length === 0) {
                    tiedUsers.push(winnerIndex);
                }
                tiedUsers.push(index);
            }
        });

        //Dealer wins if dealer and all players bust.
        if (scores.every(score => score >= bustAmount) && this.hasDealer) {
            winnerIndex = 0;
            winnerScore = scores[0];
            isDealerDefaultWin = true;
        }

        return {scores, winnerIndex, isTied, tiedUsers, isDealerDefaultWin};
    }
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

    /**
     * Shuffles deck in place using Fisher-Yates algo.
     */
    shuffle () {
        let m = this.deck.length;
        let i;

        //As long as there are elements to shuffle.
        while (m) {
            //Pick a random element.
            i = Math.floor(Math.random() * m--);

            //And swap it with the current element.
            [this.deck[m], this.deck[i]] = [this.deck[i], this.deck[m]];
        }
    }

    /**
     * Removes n-amount of cards from the top of the deck. and returns them.  Default 1 card.
     * @param {number} amount
     * @returns {cards[]}
     */
    remove (amount = 1) {
        return this.deck.splice(0, amount);
    }

    /**
     * Adds cards to the bottom of the deck.
     * @param {Card} cards - A card or array of cards to add.
     */
    add (cards: Card | Card[]) {
        if (cards instanceof Card) {
            cards = [cards];
        }
        if (!Array.isArray(cards)) {
            throw new Error('deck.add() must be passed a card or array of cards.');
        }
        this.deck = [...this.deck, ...cards];
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
        this.validate();
    }

    /**
     * Checks if a card has a valid rank and suit.
     */
    validate (): void {
        if (![...'HDSC'].includes(this.suit)) {
            throw new Error(`Card contains invalid suit of ${this.suit}.`);
        }
        if (![...'23456789','10',...'JQKA'].includes(this.rank)) {
            throw new Error(`Card contains invalid rank of ${this.rank}.`);
        }
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



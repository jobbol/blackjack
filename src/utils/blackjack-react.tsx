import {Card, Deck} from "./blackjack";

let deck: Deck;
const bustAmount = 22;

export function init ({setUsers, userCount = 2}: {setUsers: Function, userCount: number}) {
    deck = new Deck();
    deck.shuffle();
    setUsers([...Array(userCount)].map(() => deck.remove(2)));
}

export function hit ({userIndex, setUsers}: any) {
    setUsers((users:Card[][]) => {
        return users.map((user,i) => {
            if (i !== userIndex) {
                return user;
            }
            return [...user, ...deck.remove()];
        });
    });
}

export function dealerAction (params: any) {
    let {hasDealer, users, setUsers} = params;
    if (!hasDealer) {
        throw new Error('dealerAction() cannot be called, if no dealer exists in the game.');
    }

    //Dealer hits on 16 and below and stands on 17 and above.
    if (getUserScore({...params, userIndex: 0}) < 16) {
        return {action: 'hit',  hand: hit({userIndex: 0, setUsers})};
    } else {
        return {action: 'stay', hand: users[0]};
    }
}

export function getUserScore ({users, userIndex, hasDealer}: any) {
    let score = users[userIndex].reduce((total: number, card: Card) => total += card.toValue(), 0);

    //Scores that aren't busted don't need to be checked.
    if (score < bustAmount) {
        return score;
    }

    //If the dealer has busted, return their score.
    if (hasDealer && userIndex === 0) {
        return score;
    }

    //If a player has busted, attempt to reduce score if they have aces.
    let aces = users[userIndex].filter((card: Card) => card.rank === 'A').length;
    while (score >= bustAmount && aces > 0) {
        aces--;
        score-=10;
    }
    return score;
}

/**
 * Gets end stats for current game.  Returns the winner and scores.
 * For a new game, create a new Blackjack object.
 * @typedef {object} endStats
 * @property {number[]} scores - array of user scores.
 * @property {number} winnerIndex - index of the winning user.
 * @property {boolean} isTied - true if there's a tie.
 * @property {number[]} tiedUsers - array of user indexes who have tied.
 * @property {boolean} isDealerDefaultWin - If the dealer won by default for all players busting.
 * 
 * @returns {endStats}
 */
export function endStats (params: any) {
    let {users, hasDealer} = params;
    let scores = users.map((_undefined: any, i: number) => getUserScore({...params, userIndex: i}));

    let isTied = false;
    let isDealerDefaultWin = false;
    let tiedUsers: number[] = [];
    let winnerIndex = -1;
    let winnerScore = 0;

    scores.forEach((score: number, index: number) => {
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
    if (scores.every((score: number) => score >= bustAmount) && hasDealer) {
        winnerIndex = 0;
        winnerScore = scores[0];
        isDealerDefaultWin = true;
    }

    return {scores, winnerIndex, isTied, tiedUsers, isDealerDefaultWin};
}
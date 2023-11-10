import {Card, Deck} from "./blackjack";

let deck: Deck;
export const bustAmount = 22;

/**
 * Starts a new game of Blackjack.
 * @param {function} setUsers - React function which alters all user hands.
 * @param {number} userCount - Number of users / bots in the game.  The dealer is included in this number.
 */
export function init ({setUsers, userCount = 2, setGameProgress}: any) {
    deck = new Deck();
    deck.shuffle();
    setUsers([...Array(userCount)].map(() => deck.remove(2)));
    if (setGameProgress) {
        setGameProgress(0);
    }
}

/**
 * Gives a specified user a card.
 * @param {function} setUsers - React function which alters all user hands.
 * @param {number} userIndex
 */
export function hit (params: any) {
    const {userIndex, setUsers} = params;
    let score: number;
    setUsers((users:Card[][]) => {
        return users.map((user,i) => {
            if (i !== userIndex) {
                return user;
            }
            const hand = [...user, ...deck.remove()];
            score = getUserScore({...params});
            return hand;
        });
    });
}

/**
 * Gives the player a card.  On bust starts dealer action.
 * @param {function} setUsers - React function which alters all user hands.
 * @param {number} userIndex
 */
export function playerHitAction (params) {
    const {setUsers, setGameProgress} = params;

    setUsers((users:Card[][]) => {
        return users.map((user,i) => {
            if (i !== 1) {
                return user;
            }
            
            const hand = [...user, ...deck.remove()];

            //If this action causes user to bust, end the game.
            if (getUserScore({...params, userOverride: hand}) >= bustAmount) {
                setGameProgress(2);
            }

            return hand;
        });
    });
}

/**
 * Unflips dealer card.
 * Dealer may hit multiple times.
 * Ends game.
 */
export function dealerAction (params: any) {
    let {setUsers, gameProgress, setGameProgress} = params;

    if (gameProgress === 0) {
        setGameProgress(1);
    }

    //Dealer hits on 16 and below and stands on 17 and above.
    if (getUserScore({...params, userIndex: 0}) < 16) {
        hit({...params, userIndex: 0});
    } else {
        setGameProgress(2);
    }
}



export function getUserScore ({users, userOverride, userIndex, hasDealer}: any) {
    if (!userOverride && !users) {
        debugger;
    } 
    users = userOverride ?? users[userIndex];
    let score = users.reduce((total: number, card: Card) => total += card.toValue(), 0);

    //Scores that aren't busted don't need to be checked.
    if (score < bustAmount) {
        return score;
    }

    //If the dealer has busted, return their score.
    if (hasDealer && userIndex === 0) {
        return score;
    }

    //If a player has busted, attempt to reduce score if they have aces.
    let aces = users.filter((card: Card) => card.rank === 'A').length;
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
            winnerScore = score;
            isTied = false;
            tiedUsers = [];
            return;
        }

        //If this score is the equal to the winning score, then this is a tie.  Reset winner.
        if (score < bustAmount && score === winnerScore) {
            if (tiedUsers.length === 0) {
                tiedUsers.push(winnerIndex);
            }
            tiedUsers.push(index);
            isTied = true;
            winnerIndex = -1;
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
import Card from "../items/Card";
import './Game.css';
import * as blackjack from '../utils/blackjack-react';
import { useState, useRef  } from 'react';


export default function Game ({alterPage, settings, users, setUsers}: {alterPage: Function, settings: Object, users: Object[][], setUsers: Function}) {
    let [gameProgress, setGameProgress] = useState(0); //0 = player turn, 1 = dealer turn, 2 = game end.

    const options = {...settings, users, setUsers, gameProgress, setGameProgress};
    
    /**
     * Displays array of card elements to display on the screen.  Dealer will have second card face down.
     * @param {number} userIndex  - The user to look at.  0 = dealer, 1 = player 1
     */
    function getHand (userIndex) {
        return users[userIndex].map((card: any, cardIndex: number) => {
            const isDown = userIndex !== 1 && cardIndex !== 0 && gameProgress === 0;
            return <Card key={card.toString()} {...{...card, isDown}}/>;
        });
    }

    /**
     * Displays which hand belongs to which users, their current score, and if they've busted.
     * @param {number} userIndex  - The user to look at.  0 = dealer, 1 = player 1
     */
    function buildHUD (userIndex) {
        const score = blackjack.getUserScore({...options, userIndex});

        let bust = <></>;
        if (score >= blackjack.bustAmount) {
            bust = <p className="bust">Bust</p>;
        }

        let name = <></>;
        if (userIndex === 0) {
            name = <span>Dealer</span>;
        } else if (userIndex === 1) {
            name = <span>You</span>;
        } else {
            name = <span>Player {userIndex}</span>
        }

        let scoreSpan = <span>{gameProgress > 0 || userIndex !== 0? blackjack.getUserScore({...options, userIndex}):''}</span>;


        return <div className="name-and-score">
            <p>{name} {scoreSpan}</p>
            {bust}
        </div>
    }




    return <>
        <div>{gameProgress}</div>
        
        <div className="hand hand-opponent">
            {buildHUD(0)}
            {getHand(0)}
        </div>
        
        <div className="hand hand-self">
            {buildHUD(1)}
            {getHand(1)}
        </div>
        
        <div className="player-actions">
            {gameProgress === 0 &&
            <>
                <button id="stay" onClick={() => blackjack.dealerAction({...options})}>Stay</button>
                <button id="hit"  onClick={() => blackjack.playerHitAction({...options})}>Hit</button>
            </>}
            {gameProgress === 1 &&
            <>
                <button id="dealer-action" onClick={() => blackjack.dealerAction({...options})}>Continue</button>
            </>}
            {gameProgress === 2 &&
            <> 
                <button id="replay" onClick={() => blackjack.init({...options})}>Play again</button>
            </>}
        </div>

        {gameProgress === 2 &&
            <EndStats {...options}/>
        }

        <button id="back" onClick={() => alterPage('menu')}>Back</button>
    </>
}


/**
 * Displays stats at the end of the game: winner, loser, tie, and win conditions.
 */
function EndStats (options) {

    let stats = blackjack.endStats({...options});

    let text: string;
    if (stats.isDealerDefaultWin) {
        text = 'All users bust. House wins.';
    } else if (stats.isTied) {
        text = 'Tie.';
    } else if (stats.winnerIndex === 0) {
        text = 'Dealer wins.';
    } else if (stats.winnerIndex === 1) {
        text = 'You win.';
    }

    return <p id="end-stats" className="vertical-center">{text}</p>
}
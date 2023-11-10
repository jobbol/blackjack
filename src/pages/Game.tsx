import Card from "../items/Card";
import './Game.css';
import * as blackjack from '../utils/blackjack-react';
import { useState, useRef  } from 'react';


export default function Game ({alterPage, settings, users, setUsers}: {alterPage: Function, settings: Object, users: Object[][], setUsers: Function}) {
    let [isPlayerTurn, setPlayerTurn] = useState(false);

    const options = {...settings, users, setUsers, isPlayerTurn, setPlayerTurn};
    
    function getHand (userIndex) {
        return users[userIndex].map((card: any, cardIndex: number) => {
            const isDown = userIndex !== 1 && cardIndex !== 0 && isPlayerTurn;
            return <Card key={card.toString()} {...{...card, isDown}}/>;
        });
    }

    return <>
        <div className="hand hand-opponent">
            <span className="name-and-score">Dealer {!isPlayerTurn? blackjack.getUserScore({...options, userIndex: 0}):''}</span>
            {getHand(0)}
        </div>
        <div className="hand hand-self">
            <span className="name-and-score">You {blackjack.getUserScore({...options, userIndex: 1})}</span>
            {getHand(1)}
        </div>
        <div className="player-actions">
            <button id="stay" onClick={() => blackjack.dealerAction({...options})}>Stay</button>
            <button id="hit"  onClick={() => blackjack.playerHitAction({...options})}>Hit</button>
        </div>
        <button id="back" onClick={() => alterPage('menu')}>Back</button>
    </>
}
import './Menu.css';


/**
 * Main menu page.  Displays the title and lets user choose between multiplayer or single player.
 */
export default function Menu ({alterPage, alterSettings}: any) {
    return <>
        <div className="vertical-center">
            <h1>
                <Suits direction="left"/>
                <span>Blackjack</span>
                <Suits direction="right"/>
            </h1>
            <div id="button-container">
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        alterSettings({hasDealer: false});
                        alterPage('game');
                }}>Multiplayer</button>
                <button 
                    id="btn-game"
                    className="btn btn-primary"
                    onClick={() => {
                        alterSettings({hasDealer: true});
                        alterPage('game');
                }}>Single Player</button>
            </div>
        </div>
    </>;
}



/**
 * Creates a decorative element of suit icons to be placed on the sides of the game name.
 * @param {'left' | 'right'} direction
 */
function Suits ({direction}: {direction: 'left' | 'right'}) {
    let suits;
    if (direction === 'left') {
        suits = ['♦','♠','♥','♣'];
    } else {
        suits = ['♣','♥','♠','♦'];
    }

    let suitsJSX = suits.map((char: string, i: number) => {
        let className;
        if (direction === 'left') {
            className = i % 2? 'black' : 'red';
        } else {
            className = i % 2? 'red': 'black';
        }
        return <span className={className} key={char}>{char}</span>
    });

    return <small>{suitsJSX}</small>
}
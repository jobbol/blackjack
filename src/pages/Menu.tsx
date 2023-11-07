import './Menu.css';
export default function Menu ({alterPage, alterSettings}: any) {
    return <main>
        <h1>
            <small>♦ ♠ ♥ ♣</small>
            <span>Blackjack</span>
            <small>♣ ♥ ♠ ♦</small>
        </h1>
        {/* <div id="suits">♦ ♥ ♠ ♣</div> */}
        <button
            className="btn-secondary"
            onClick={() => {
                alterSettings({hasDealer: false});
                alterPage('game');
        }}>Multiplayer</button>
        <button 
            className="btn-primary btn-game"
            onClick={() => {
                alterSettings({hasDealer: true});
                alterPage('game');
        }}>Single Player</button>
    </main>;
}
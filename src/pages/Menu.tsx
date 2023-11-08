import './Menu.css';
import 'bootstrap/dist/css/bootstrap.css';

export default function Menu ({alterPage, alterSettings}: any) {
    const suitsLeft = ['♦','♠','♥','♣'].map((char: string, i: number) => {
        return <span className={i % 2? 'black' : 'red'} key={char}>{char}</span>
    });
    const suitsRight = ['♣','♥','♠','♦'].map((char: string, i: number) => {
        return <span className={i % 2? 'red' : 'black'} key={char}>{char}</span>
    });

    return <main>
        <h1>
            <small>{suitsLeft}</small>
            <span>Blackjack</span>
            <small>{suitsRight}</small>
        </h1>
        <div className="jumbotron">asdfjasdfj</div>
        <button
            className="button btn-secondary"
            onClick={() => {
                alterSettings({hasDealer: false});
                alterPage('game');
        }}>Multiplayer</button>
        <button 
            className="button btn-primary btn-game"
            onClick={() => {
                alterSettings({hasDealer: true});
                alterPage('game');
        }}>Single Player</button>
    </main>;
}
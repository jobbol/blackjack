import Card from "../items/Card";
import './Game.css';


export default function Game ({alterPage}: {alterPage: Function}) {

    return <main>
        <div className="hand">
            <div>
                <Card {...{suit: 'C', rank: 'J'}}/>
            </div>
            <div>
                <Card {...{suit: 'H', rank: '7'}}/>
            </div>
        </div>
        <button id="back" onClick={() => alterPage('menu')}>Back</button>
    </main>
}
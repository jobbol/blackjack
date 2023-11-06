import Card from "../items/Card";
import './Game.css';



export default function Game ({alterPage}: {alterPage: Function}) {

    return <>
        <div className="hand">
            <div>
                <Card {...{suit: 'C', rank: 'J'}}/>
            </div>
            <div>
                <Card {...{suit: 'H', rank: '7'}}/>
            </div>
        </div>
    </>
}
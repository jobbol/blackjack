import './Card.css';


export interface typeCard {

}

export default function Card ({suit, rank, isDown}: {suit: string, rank: string, isDown: boolean}) {
    const suitsShort = {
        'D': '♦',
        'H': '♥',
        'S': '♠',
        'C': '♣'
    }

    const suitToColor = {
        'D': 'red',
        'H': 'red',
        'S': 'black',
        'C': 'black'
    }

    const color = suitToColor[suit as keyof typeof suitToColor];
    suit = suitsShort[suit as keyof typeof suitsShort];

    if (isDown) {
        return (
            <div className="card-container">
                <div className="card face-down">
                    <div className="inner-border">&nbsp;</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-container">
            <div className={"card " + color}>
                <div className="corner tl">{suit}</div>
                <div className="corner br">{suit}</div>
                <div className="center">{rank}{suit}</div>
            </div>
        </div>
    );
}
import { useGame } from '../game.context';

export default function GameOverModal() {

    const { game, restartGame } = useGame();
    const message = game.winner === game.player1 ? 'You win!' : 'Computer wins!';
    
    return <>
        { 
            game.winner &&
            <div className="overlay">
                <h1 className="overlay__message">{message}</h1>
                <button className="overlay__button" onClick={() => restartGame()}>Play again</button>
            </div>
        }
    </>;

};
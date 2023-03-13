import { useGame } from '../game.context';
import Game from '../modules/Game';
import Player from '../modules/Player';
import predefinedShips from '../ships.json';

function GameOverScreen() {
    const { game, setGame } = useGame();
    const message = game.winner === game.player1 ? 'You win!' : 'Computer wins!';
    const handleClick = () => {
        const player1 = new Player('Player 1');
        const player2 = new Player('Player 2', false);
        player2.gameboard.randomize(predefinedShips);
        setGame(new Game(player1, player2));
    }
    return <>
        {
            game.winner &&
            <div className="overlay">
                <h1 className="overlay__message">{message}</h1>
                <button className="overlay__button" onClick={handleClick}>Play again</button>
            </div>
        }
    </>;
}

export default GameOverScreen;
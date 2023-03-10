import Gameboard from './components/Gameboard';
import Game from './modules/Game';
import Player from './modules/Player';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import randomizeBoard from './utils/randomizeBoard';
import { useState } from 'react';

export default function App () {

    const player1 = new Player('Player 1');
    const player2 = new Player('Player 2', false);

    randomizeBoard(player2.gameboard);

    const [ game, setGame ] = useState(new Game(player1, player2));

    return <DndProvider backend={HTML5Backend}>
        <div className="gameboards__wrapper">
            <Gameboard player={game.player2} game={game} setGame={setGame} />
            <Gameboard player={game.player1} game={game} setGame={setGame} />
        </div>
        {game.winner && <Overlay game={game} setGame={setGame} />}
    </DndProvider>;

};

function Overlay (props: { game: Game, setGame: Function }) {

    const { game, setGame } = props;

    const message = () => game.winner === game.player1
        ? 'You win!'
        : 'Computer wins!';

    const handleClick = () => {
        const player1 = new Player('Player 1');
        const player2 = new Player('Player 2', false);
        randomizeBoard(player2.gameboard);
        setGame(new Game(player1, player2));
    }

    return (
        <div className="overlay">
            <h1 className="overlay__message">{message()}</h1>
            <button className="overlay__button" onClick={handleClick}>Play again</button>
        </div>
    );

}
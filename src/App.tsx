import Gameboard from './components/Gameboard';
import Game from './modules/Game';
import Player from './modules/Player';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import randomizeBoard from './utils/randomizeBoard';
import { useState } from 'react';

const player1 = new Player('Player 1');
const player2 = new Player('Player 2', false);

randomizeBoard(player2.gameboard);

export default function App () {

    const [ game, setGame ] = useState(new Game(player1, player2));

    return <DndProvider backend={HTML5Backend}>
        <div className="gameboards__wrapper">
            <Gameboard player={game.player1} game={game} setGame={setGame} />
            <Gameboard player={game.player2} game={game} setGame={setGame} />
        </div>
    </DndProvider>;

};
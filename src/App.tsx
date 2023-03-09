import Gameboard from './components/Gameboard';
import Game from './modules/Game';
import Player from './modules/Player';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import randomizeBoard from './utils/randomizeBoard';
import { useState } from 'react';

const player1 = new Player('Player 1');
const player2 = new Player('Player 2', false);

const game = new Game(player1, player2);

randomizeBoard(player2.gameboard);

export default function App () {

    const [ isStarted, setIsStarted ] = useState(false)

    return <DndProvider backend={HTML5Backend}>
        <div className="gameboards__wrapper">
            <Gameboard player={player1} game={game} isStarted={isStarted} setIsStarted={setIsStarted} />
            <Gameboard player={player2} game={game} isStarted={isStarted} setIsStarted={setIsStarted} />
        </div>
    </DndProvider>
}
import { DndProvider } from 'react-dnd';
import { GameProvider } from '../game.context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Gameboard from './Gameboard';
import GameOverModal from './GameOverModal';
import Game from '../modules/Game';
import Player from '../modules/Player';
import predefinedShips from '../ships.json';

function App() {
    
    const player1 = new Player('Player 1');
    const player2 = new Player('Player 2', false);
    const game = new Game(player1, player2);
    player2.gameboard.randomize(predefinedShips);

    return (
        <DndProvider backend={HTML5Backend}>
            <GameProvider state={game} >
                <div className="gameboards">
                    <Gameboard isHuman={false} />
                    <Gameboard isHuman={true} />
                </div>
                <GameOverModal />
            </GameProvider>
        </DndProvider>
    );

}

export default App;
import { DndProvider } from 'react-dnd';
import { GameProvider } from '../game.context';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Gameboard from './Gameboard';
import GameOverModal from './GameOverModal';

export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <GameProvider >
                <div className="gameboards">
                    <Gameboard isHuman={false} />
                    <Gameboard isHuman={true} />
                </div>
                <GameOverModal />
            </GameProvider>
        </DndProvider>
    );
};
import { useGame } from '../game.context';
import { useState } from 'react';
import GameboardControls from './GameboardControls';
import Ship from '../model/Ship';
import TileGrid from './TileGrid';

export default function Gameboard (props: { isHuman: boolean }) {

    const { isHuman } = props;
    const [currentShip, setCurrentShip] = useState<Ship>(new Ship(1, 5));
    const [placingMode, setPlacingMode] = useState('horizontal');
    const { game, startGame } = useGame();
    const player = isHuman ? game.player1 : game.player2;

    return (
        <div className="gameboard">
            <h2 className="gameboard__title">{isHuman ? "Your board" : "Opponent's board"}</h2>
            <div className="gameboard__grid">
                { 
                    (!isHuman && !game.isStarted) &&
                    <>
                        <div className="gameboard__blur"></div>
                        <button className="gameboard__startButton" onClick={() => startGame()}>Start</button>
                    </>
                }
                <TileGrid player={player} setCurrentShip={setCurrentShip} setPlacingMode={setPlacingMode} />
            </div>
            {
                (isHuman && !game.isStarted) &&
                <GameboardControls 
                    currentShip={currentShip} 
                    placingMode={placingMode} 
                    player={player} 
                    setCurrentShip={setCurrentShip} 
                    setPlacingMode={setPlacingMode} 
                />
            }
        </div>
    );
    
};
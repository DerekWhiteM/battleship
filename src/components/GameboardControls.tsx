import { useGame } from '../game.context';
import PlaceableShip from './Ship';
import Player from '../modules/Player';
import predefinedShips from '../ships.json';
import Ship from '../modules/Ship';

type Props = {
    currentShip: Ship, 
    placingMode: string, 
    player: Player,  
    setCurrentShip: Function, 
    setPlacingMode: Function
};

export default function GameboardControls(props: Props) {

    const { currentShip, placingMode, player, setCurrentShip, setPlacingMode } = props;
    const { refreshGame } = useGame();

    const randomize = () => {
        const ship = document.getElementsByClassName('ship')[0] as HTMLElement;
        if (!ship) return;
        ship.style.display = 'none';
        player.gameboard.placedShips = [];
        player.gameboard.randomize(predefinedShips);
        refreshGame();
    };

    const reset = () => {
        player.gameboard.placedShips = [];
        const predefinedShip = predefinedShips[0];
        const ship = new Ship(predefinedShip.id, predefinedShip.length);
        setCurrentShip(ship);
        setPlacingMode('horizontal');
        const shipElement = document.getElementsByClassName('ship')[0] as HTMLElement;
        shipElement.style.display = 'grid';
    };

    return <>
        <div className="gameboard__controls">
            <button className="gameboard__controls__button" onClick={randomize}>
                Randomize
            </button>
            <button className="gameboard__controls__button" onClick={reset}>
                Reset
            </button>
        </div>
        <PlaceableShip 
            id={String(currentShip.id)} 
            length={currentShip.length} 
            placingMode={placingMode} 
            setPlacingMode={setPlacingMode} 
        />
    </>;
    
};
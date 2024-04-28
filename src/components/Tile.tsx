import { DropTargetMonitor, useDrop } from 'react-dnd';
import { getDropLocation, makeAutomatedMoves } from '../utils';
import { useGame } from '../game.context';
import Player from '../model/Player';
import predefinedShips from '../ships.json';
import Ship from '../model/Ship';
import type { DraggableShip } from '../types';

type Props = {
    className: string,  
    player: Player,
    setCurrentShip: Function, 
    setPlacingMode: Function, 
    x: number, 
    y: number, 
};

export default function Tile(props: Props) {

    const { className, player, setCurrentShip, setPlacingMode, x, y, } = props;
    const { game, refreshGame } = useGame();

    const handleClick = async (event: React.MouseEvent) => {
        const target = event.target as HTMLDivElement;
        const coords = {
            x: Number(target.dataset.x),
            y: Number(target.dataset.y)
        };
        if (game.turn !== player && player.gameboard.isValidAttack(coords)) {
            const attack = player.gameboard.receiveAttack(coords);
            refreshGame();
            if (attack) return;
            game.changeTurn();
            makeAutomatedMoves(game, refreshGame);
        }
    };

    const handleDrop = (item: DraggableShip, monitor: DropTargetMonitor) => {
        item.location = getDropLocation(item, monitor, x, y);
        if (!player.gameboard.isValidLocation(item.location)) return;
        const ship = new Ship(item.id, item.length, item.location);
        player.gameboard.placeShip(ship);
        const nextPredefinedShip = predefinedShips.find(el => el.id === Number(item.id) + 1);
        if (nextPredefinedShip) {
            const nextShip = new Ship(nextPredefinedShip.id, nextPredefinedShip.length);
            if (!nextShip) return;
            setPlacingMode('horizontal');
            setCurrentShip(nextShip);
        } else {
            const ship = document.getElementsByClassName('ship')[0] as HTMLElement;
            if (!ship) return;
            ship.style.display = 'none';
            refreshGame();
        }
    };

    const [ collectProps, drop ] = useDrop(() => ({ accept: 'ship', drop: handleDrop }), [player]);
    
    return <div className={className} data-x={x} data-y={y} onClick={handleClick} ref={drop}></div>;

};
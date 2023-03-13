import { isValidAttack } from '../modules/Gameboard';
import { useDrop } from 'react-dnd';
import { useGame } from '../game.context';
import Player from '../modules/Player';
import predefinedShips from '../ships.json';
import Ship from '../modules/Ship';

type Props = {
    className: string,  
    player: Player,
    setCurrentShip: Function, 
    setPlacingMode: Function, 
    x: number, 
    y: number, 
};

function Tile(props: Props) {
    const { className, player, setCurrentShip, setPlacingMode, x, y, } = props;
    const { game, refreshGame } = useGame();
    const handleClick = async (e: any) => {
        const coords = {
            x: Number(e.target.dataset.x),
            y: Number(e.target.dataset.y)
        };
        const makeAutomatedMovesRec = async (): Promise<any> => {
            const timeout = new Promise(resolve => setTimeout(resolve, 500));
            await timeout;
            const attack = game.player2.attack(game.player1.gameboard);
            refreshGame();
            if (attack) return makeAutomatedMovesRec();
            game.changeTurn();
            refreshGame();
        };
        if (game.turn !== player && isValidAttack(player.gameboard.receivedAttacks, coords)) {
            const attack = player.gameboard.receiveAttack(coords);
            refreshGame();
            if (!attack) {
                game.changeTurn();
                makeAutomatedMovesRec();
            }
        }
    };
    const handleDrop = (item: any, monitor: any) => {

        const getDropLocation = () => {
            const initialClientOffset = monitor.getInitialClientOffset();
            const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
            const index = item.placingMode === 'horizontal'
                ? Math.ceil((initialClientOffset.x - initialSourceClientOffset.x) / 48) - 1
                : Math.ceil((initialClientOffset.y - initialSourceClientOffset.y) / 48) - 1;
            const horizontalLocation = {
                start: { x: x - index, y },
                end: { x: x - index + item.length - 1, y }
            };
            const verticalLocation = {
                start: { x, y: y - index },
                end: { x, y: y - index + item.length - 1 }
            };
            return item.placingMode === 'horizontal'
                ? horizontalLocation
                : verticalLocation;
        };

        const location = getDropLocation();
        if ((location.start.x < 0 || location.end.x > 9) || (location.start.y < 0 || location.end.y > 9)) return alert('Invalid location');

        item.location = location;
        player.gameboard.placeShip(item);

        const nextPredefinedShip = predefinedShips.find(el => el.id === Number(item.id) + 1);

        if (nextPredefinedShip) {
            const nextShip = new Ship(nextPredefinedShip.id, nextPredefinedShip.length);
            if (nextShip) {
                setPlacingMode('horizontal');
                setCurrentShip(nextShip);
            }
        }

        if (!nextPredefinedShip) {
            const ship = document.getElementsByClassName('ship')[0] as HTMLElement;
            if (!ship) return;
            ship.style.display = 'none';
        }

    };
    const [ collectProps, drop ] = useDrop(() => ({ accept: 'ship', drop: handleDrop }));
    return <div className={className} data-x={x} data-y={y} onClick={handleClick} ref={drop}></div>;
}

export default Tile;
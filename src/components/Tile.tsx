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

export default function Tile(props: Props) {
    const { className, player, setCurrentShip, setPlacingMode, x, y, } = props;
    const { game, refreshGame } = useGame();
    const handleClick = async (e: any) => {
        const coords = {
            x: Number(e.target.dataset.x),
            y: Number(e.target.dataset.y)
        };
        const makeAutomatedMovesRec = async (): Promise<any> => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const attack = game.player2.attack(game.player1.gameboard);
            refreshGame();
            if (attack) return makeAutomatedMovesRec();
            game.changeTurn();
            refreshGame();
        };
        if (game.turn !== player && player.gameboard.isValidAttack(coords)) {
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
            const rem = (multiplier: number) => {
                const root = document.getElementsByTagName('html')[0];
                const fontSize = parseFloat(window.getComputedStyle(root, null).getPropertyValue('font-size'));
                return fontSize * multiplier;
            };
            const index = item.placingMode === 'horizontal'
                ? Math.ceil((initialClientOffset.x - initialSourceClientOffset.x) / rem(3)) - 1
                : Math.ceil((initialClientOffset.y - initialSourceClientOffset.y) / rem(3)) - 1;
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
        if (!player.gameboard.isValidLocation(location)) return;
        item.location = location;
        player.gameboard.placeShip(new Ship(item.id, item.length, item.location));
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
        }
    };
    const [ collectProps, drop ] = useDrop(() => ({ accept: 'ship', drop: handleDrop }));
    return <div className={className} data-x={x} data-y={y} onClick={handleClick} ref={drop}></div>;
};
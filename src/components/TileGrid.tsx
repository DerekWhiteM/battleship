import Player from '../modules/Player';
import Tile from './Tile';

type Props = {
    player: Player, 
    setCurrentShip: Function, 
    setPlacingMode: Function
};

export default function TileGrid(props: Props) {

    const { player, setPlacingMode, setCurrentShip } = props;
    const elements = [];
    let index = 0;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            const placedShip = player.gameboard.placedShips.find(placedShip => placedShip.isHit({ x: j, y: i }));

            const receivedAttack = player.gameboard.receivedAttacks.find(attack => {
                return JSON.stringify(attack.coords) === JSON.stringify({ x: j, y: i });
            });

            const orientation = placedShip?.location?.start.y === placedShip?.location?.end.y
                ? 'horizontal'
                : 'vertical';

            const indexOfShip = () => {
                if (!placedShip?.location) return null;
                return orientation === 'horizontal'
                    ? j - placedShip.location.start.x
                    : i - placedShip.location.start.y;
            };

            const className = () => {
                if (!placedShip || (!player.isHuman && !placedShip.isSunk())) return 'gameboard__grid__item';
                if (orientation === 'horizontal') {
                    if (indexOfShip() === 0) return 'gameboard__grid__item--ship-h-first';
                    if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-h-last';
                    else return 'gameboard__grid__item--ship-h-middle';
                }
                else {
                    if (indexOfShip() === 0) return 'gameboard__grid__item--ship-v-first';
                    if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-v-last';
                    else return 'gameboard__grid__item--ship-v-middle';
                }
            };

            const attackModifer = () => {
                if (!receivedAttack) return '';
                return receivedAttack.isHit ? ' hit' : ' miss';
            };

            elements.push(
                <Tile 
                    className={className() + attackModifer()} 
                    key={index} 
                    x={j} 
                    y={i}
                    player={player}
                    setPlacingMode={setPlacingMode}
                    setCurrentShip={setCurrentShip}
                ></Tile>
            );

            index++;

        }
    }

    return <>{elements}</>;

};
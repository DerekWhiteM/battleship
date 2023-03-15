import { DropTargetMonitor } from 'react-dnd';
import Game from './modules/Game';
import type { DraggableShip } from './types';

export function getDropLocation(item: DraggableShip, monitor: DropTargetMonitor, x: number, y: number) {
    const initialClientOffset = monitor.getInitialClientOffset();
    const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
    if (!initialClientOffset || !initialSourceClientOffset) return null;
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

export async function makeAutomatedMoves(game: Game, refreshGame: Function): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const attack = game.player2.attack(game.player1.gameboard);
    refreshGame();
    if (attack) return makeAutomatedMoves(game, refreshGame);
    game.changeTurn();
    refreshGame();
};
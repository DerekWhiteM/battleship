import _ from 'lodash';
import { createContext, ReactElement, useContext, useState } from 'react';
import Game from './modules/Game';
import Player from './modules/Player';
import predefinedShips from './ships.json';

type Props = {
    children: Array<ReactElement>
};

type Context = {
    game: Game, 
    refreshGame: Function, 
    restartGame: Function, 
    startGame: Function
};

const player1 = new Player('Player 1');
const player2 = new Player('Player 2', false);
const initialGame = new Game(player1, player2);
player2.gameboard.randomize(predefinedShips);

const GameContext = createContext<Context>({
    game: initialGame, 
    refreshGame: () => null, 
    restartGame: () => null, 
    startGame: () => null
});

export const useGame = () => useContext(GameContext);

export function GameProvider({ children }: Props) {
    const [ game, setGame ] = useState(initialGame);
    const refreshGame = () => setGame(_.cloneDeep(game));
    const restartGame = () => setGame(new Game(player1, player2));
    const startGame = () => {
        if (game.player1.gameboard.placedShips.length === game.player2.gameboard.placedShips.length) {
            game.start();
            refreshGame();
        }
    };
    return (
        <GameContext.Provider value={{ game, refreshGame, restartGame, startGame }}>
            {children}
        </GameContext.Provider>
    );
};
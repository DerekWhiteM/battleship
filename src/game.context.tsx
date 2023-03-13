import _ from 'lodash';
import { createContext, ReactElement, useContext, useState } from 'react';
import Game from './modules/Game';

type Props = {
    state: Game,
    children: Array<ReactElement>
};

const GameContext = createContext<any>(null);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ state, children }: Props) => {
    const [ game, setGame ] = useState(state);
    const refreshGame = () => setGame(_.cloneDeep(game));
    const startGame = () => {
        if (game.player1.gameboard.placedShips.length === game.player2.gameboard.placedShips.length) {
            game.start();
            refreshGame();
        }
    };
    return (
        <GameContext.Provider value={{ game, refreshGame, startGame }}>
            {children}
        </GameContext.Provider>
    );
};
import Gameboard from "./components/Gameboard"
import Game from "./modules/Game"
import Player from "./modules/Player"

import Ship from "./components/Ship"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const player1 = new Player('Player 1')
const player2 = new Player('Player 2')

const game = new Game(player1, player2)

export default function App () {
    return <DndProvider backend={HTML5Backend}>
        <Ship id={'1'} length={2} />
        <div className="gameboards__wrapper">
            <Gameboard player={player1} game={game} />
            <Gameboard player={player2} game={game} />
        </div>
    </DndProvider>
}
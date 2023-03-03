import Gameboard from "./components/Gameboard"
import Game from "./modules/Game"
import Player from "./modules/Player"

const player1 = new Player('Player 1')
const player2 = new Player('Player 2')

const game = new Game(player1, player2)

player1.gameboard.placeShip(2, { 
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 } 
})

player2.gameboard.placeShip(2, { 
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 } 
})

export default function App () {
    return <>
        <div className="gameboards__wrapper">
            <Gameboard player={player1} game={game} />
            <Gameboard player={player2} game={game} />
        </div>
    </>
}
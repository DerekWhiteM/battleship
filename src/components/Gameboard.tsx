import Player from "../modules/Player"
import { isHit, isValidAttack } from "../modules/Gameboard"
import Game from "../modules/Game"

export default function Gameboard (props: { player: Player, game: Game }) {
    const { player, game } = props
    return (
        <div className="gameboard">
            <h2>{player.name}</h2>
            <div className="gameboard__grid">
                <Tiles />
            </div>
        </div>
    )

    function Tiles () {
        let elements = []
        let count = 0
        for (let i = 0; i < 10; i++) {
            for (let j =0; j < 10; j++) {
                const shipTile = player.gameboard.placedShips.find(placedShip => isHit(placedShip, { x: j, y: i }))
                const className = shipTile
                    ? "gameboard__grid__item--ship"
                    : "gameboard__grid__item"
                elements.push(<div className={className} key={count} data-x={j} data-y={i} onClick={handleClick}></div>)
                count++
            }
        }
        return <>{elements}</>
        function handleClick (e: any) {
            const coords = {
                x: Number(e.target.dataset.x),
                y: Number(e.target.dataset.y)
            }
            if (game.turn === player) {
                alert('It is not your turn')
            }
            else if (!isValidAttack(player.gameboard.receivedAttacks, coords)) {
                alert('Invalid attack')
            } 
            else {
                if (player.gameboard.receiveAttack(coords)) {
                    game.winner
                        ? alert(`${game.winner.name} wins`)
                        : alert('Hit')
                } else {
                    alert('Miss')
                }
            }
        }
    }

}
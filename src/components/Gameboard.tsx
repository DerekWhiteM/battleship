import Player from "../modules/Player"
import { isHit, isValidAttack } from "../modules/Gameboard"
import Game from "../modules/Game"
import { useDrop } from 'react-dnd'
import Ship from "../modules/Ship"
import { useState } from "react"
import ShipComponent from "./Ship"
import predefinedShips from '../ships.json'

export default function Gameboard (props: { player: Player, game: Game }) {
    const { player, game } = props

    const [ships, setShips] = useState<Array<Ship>>([])
    const [currentShip, setCurrentShip] = useState<Ship>(new Ship(1, 5))
    const [placingMode, setPlacingMode] = useState('horizontal')
    const title = player.isHuman ? "Your board" : "Enemy's board"

    return (
        <div className="gameboard">
            <h2>{title}</h2>
            <div className="gameboard__grid">
                <Tiles />
            </div>
            {player.isHuman && 
                <div className="gameboard__controls">
                    <button className="gameboard__controls__reset" onClick={() => {
                        player.gameboard.placedShips = []
                        setShips(player.gameboard.placedShips)
                        const predefinedShip = predefinedShips[0]
                        const ship = new Ship(predefinedShip.id, predefinedShip.length)
                        setCurrentShip(ship)
                        const shipElement = document.getElementsByClassName('ship')[0] as HTMLElement
                        shipElement.style.display = 'grid'
                    }}>Reset</button>
                    <ShipComponent id={String(currentShip.id)} length={currentShip.length} placingMode={placingMode} setPlacingMode={setPlacingMode}/>
                </div>
            }
        </div>
    )

    function Tiles () {
        let elements = []
        let count = 0
        for (let i = 0; i < 10; i++) {
            for (let j =0; j < 10; j++) {
                const placedShip = player.gameboard.placedShips.find(placedShip => isHit(placedShip, { x: j, y: i }))
                const orientation = placedShip?.location?.start.y === placedShip?.location?.end.y
                    ? 'horizontal'
                    : 'vertical'
                const indexOfShip = () => {
                    if (!placedShip?.location) return null
                    if (orientation === 'horizontal') {
                        return j - placedShip.location.start.x
                    } else {
                        return i - placedShip.location.start.y
                    }
                }
                const className = () => {
                    if (!placedShip) return 'gameboard__grid__item'
                    if (orientation === 'horizontal') {
                        if (indexOfShip() === 0) return 'gameboard__grid__item--ship-h-first'
                        if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-h-last'
                        else return 'gameboard__grid__item--ship-h-middle'
                    }
                    else {
                        if (indexOfShip() === 0) return 'gameboard__grid__item--ship-v-first'
                        if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-v-last'
                        else return 'gameboard__grid__item--ship-v-middle'
                    }
                }
                elements.push(<Tile className={className()} key={count} x={j} y={i}></Tile>)
                count++
            }
        }
        return <>{elements}</>
    }

    function Tile (props: { className: string, x: number, y: number }) {
        let { className, x, y } = props
        const [collectProps, drop] = useDrop(() => ({
            accept: 'ship',
            drop: (item: any, monitor: any) => {

                const location = getDropLocation()
                if (location.start.x < 0 || location.end.x > 9) return alert('Invalid location')

                setShips(prevState => {
                    const arr = [...prevState]
                    currentShip.location = location
                    player.gameboard.placeShip(currentShip)
                    arr.push(currentShip)
                    return arr
                })

                const nextPredefinedShip = predefinedShips.find(el => {
                    return el.id === Number(currentShip.id) + 1
                })

                if (nextPredefinedShip) {
                    const nextShip = new Ship(nextPredefinedShip.id, nextPredefinedShip.length)
                    if (nextShip) {
                        setPlacingMode('horizontal')
                        setCurrentShip(nextShip)
                    }
                }

                if (!nextPredefinedShip) {
                    const ship = document.getElementsByClassName('ship')[0] as HTMLElement
                    if (!ship) return
                    ship.style.display = 'none'
                }

                function getDropLocation () {
                    const initialClientOffset = monitor.getInitialClientOffset()
                    const initialSourceClientOffset = monitor.getInitialSourceClientOffset()
                    const index = placingMode === 'horizontal'
                        ? Math.ceil((initialClientOffset.x - initialSourceClientOffset.x) / 48) - 1
                        : Math.ceil((initialClientOffset.y - initialSourceClientOffset.y) / 48) - 1
                    const horizontalLocation = { 
                        start: { x: x - index, y }, 
                        end: { x: x - index + currentShip.length - 1, y } 
                    }
                    const verticalLocation = { 
                        start: { x, y: y - index }, 
                        end: { x, y: y - index + currentShip.length - 1 } 
                    }
                    return placingMode === 'horizontal'
                        ? horizontalLocation
                        : verticalLocation
                }

            }
        }))
        return <div className={className} data-x={x} data-y={y} onClick={handleClick} ref={drop}></div>

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
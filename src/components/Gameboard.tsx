import Player from "../modules/Player"
import { isHit, isValidAttack } from "../modules/Gameboard"
import Game from "../modules/Game"
import { useDrop } from 'react-dnd'
import Ship from "../modules/Ship"
import { useState } from "react"
import ShipComponent from "./Ship"
import predefinedShips from '../ships.json'
import randomizeBoard from "../utils/randomizeBoard"
import _ from 'lodash'

export default function Gameboard(props: { player: Player, game: Game, setGame: Function }) {

    const { player, game, setGame } = props

    const [ships, setShips] = useState(player.gameboard.placedShips)
    const [currentShip, setCurrentShip] = useState<Ship>(new Ship(1, 5))
    const [placingMode, setPlacingMode] = useState('horizontal')
    const title = player.isHuman ? "Your board" : "Enemy's board"

    function startGame() {
        if (game.player1.gameboard.placedShips.length === game.player2.gameboard.placedShips.length) {
            game.start()
            setGame((prevState: Game) => _.cloneDeep(prevState))
        }
    }

    return (
        <div className="gameboard">
            <h2 className="gameboard__title">{title}</h2>
            <div className="gameboard__grid">
                {(!player.isHuman && !game.isStarted) &&
                    <>
                        <div className="gameboard__blur"></div>
                        <button className="gameboard__startButton" onClick={() => startGame()}>Start</button>
                    </>
                }
                <Tiles />
            </div>
            {(player.isHuman && !game.isStarted) &&
                <>
                    <div className="gameboard__controls">
                        <button className="gameboard__controls__button" onClick={() => {
                            const ship = document.getElementsByClassName('ship')[0] as HTMLElement
                            if (!ship) return
                            ship.style.display = 'none'
                            player.gameboard.placedShips = []
                            randomizeBoard(player.gameboard)
                            setShips(player.gameboard.placedShips)
                        }}>Randomize</button>
                        <button className="gameboard__controls__button" onClick={() => {
                            player.gameboard.placedShips = []
                            setShips(player.gameboard.placedShips)
                            const predefinedShip = predefinedShips[0]
                            const ship = new Ship(predefinedShip.id, predefinedShip.length)
                            setCurrentShip(ship)
                            setPlacingMode('horizontal')
                            const shipElement = document.getElementsByClassName('ship')[0] as HTMLElement
                            shipElement.style.display = 'grid'
                        }}>Reset</button>
                    </div>
                    <ShipComponent id={String(currentShip.id)} length={currentShip.length} placingMode={placingMode} setPlacingMode={setPlacingMode} />
                </>
            }
        </div>
    )

    function Tiles() {
        let elements = []
        let count = 0
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const placedShip = player.gameboard.placedShips.find(placedShip => isHit(placedShip, { x: j, y: i }))
                const receivedAttack = player.gameboard.receivedAttacks.find(attack => JSON.stringify(attack.coords) === JSON.stringify({ x: j, y: i }))
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
                    if (!placedShip || (!player.isHuman && !placedShip.isSunk())) return 'gameboard__grid__item'
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

                const attackModifer = () => {
                    if (!receivedAttack) return '';
                    return receivedAttack.isHit ? ' hit' : ' miss';
                }

                elements.push(<Tile className={className() + attackModifer()} key={count} x={j} y={i}></Tile>)
                count++
            }
        }
        return <>{elements}</>
    }

    function Tile(props: { className: string, x: number, y: number }) {
        let { className, x, y } = props
        const [collectProps, drop] = useDrop(() => ({
            accept: 'ship',
            drop: (item: any, monitor: any) => {

                const location = getDropLocation()
                if ((location.start.x < 0 || location.end.x > 9) || (location.start.y < 0 || location.end.y > 9)) return alert('Invalid location')

                setShips(prevState => {
                    const arr = [...prevState]
                    currentShip.location = location
                    player.gameboard.placeShip(currentShip)
                    arr.push(currentShip)
                    return arr
                })

                const nextPredefinedShip = predefinedShips.find(el => el.id === Number(currentShip.id) + 1)

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

                function getDropLocation() {
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

        async function handleClick(e: any) {
            const coords = {
                x: Number(e.target.dataset.x),
                y: Number(e.target.dataset.y)
            }
            if (game.turn !== player && isValidAttack(player.gameboard.receivedAttacks, coords)) {
                const attack = player.gameboard.receiveAttack(coords)
                setGame((prevState: Game) => _.cloneDeep(prevState));
                if (!attack) {
                    game.changeTurn()
                    makeAutomatedMovesRec() 
                }
                async function makeAutomatedMovesRec(): Promise<any> {
                    const timeout = new Promise(resolve => setTimeout(resolve, 500));
                    await timeout;
                    const attack = game.player2.attack(game.player1.gameboard);
                    const clonedGame = _.cloneDeep(game)
                    setGame(() => clonedGame);
                    if (attack) return makeAutomatedMovesRec();
                    clonedGame.changeTurn();
                    setGame(() => clonedGame);
                }
            }
        }

    }

}


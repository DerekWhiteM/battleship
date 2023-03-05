import Gameboard from "../modules/Gameboard";
import Ship from "../modules/Ship";
import predefinedShips from "../ships.json";

export default function randomizeBoard(gameboard: Gameboard) {
    for (const predefinedShip of predefinedShips) {
        const ship = new Ship(predefinedShip.id, predefinedShip.length)
        ship.location = generateRandomLocation(gameboard, ship)
        gameboard.placeShip(ship)
    }
}

function generateRandomLocation (gameboard: Gameboard, ship: Ship): any {

    function getRandomNumber () {
        return Math.floor(Math.random() * 10)
    }

    const start = {
        x: getRandomNumber(),
        y: getRandomNumber()
    }

    const orientation = Math.random() >= .5
        ? 'horizontal'
        : 'vertical'

    const end = () => {
        if (orientation === 'horizontal') {
            return {
                x: start.x + ship.length - 1,
                y: start.y
            }
        } else {
            return {
                x: start.x,
                y: start.y + ship.length - 1
            }
        }
    }

    const randomLocation = {
        start,
        end: end()
    }

    if (gameboard.isValidLocation(randomLocation)) {
        return randomLocation
    } else {
        return generateRandomLocation(gameboard, ship)
    }

}
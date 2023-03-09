import Game from './Game'
import Gameboard, { Coordinates, isValidAttack } from './Gameboard'

export default class Player {

    name
    isHuman
    gameboard

    constructor (name: string, isHuman = true) {
        this.name = name
        this.isHuman = isHuman
        this.gameboard = new Gameboard
    }

    attack (gameboard: Gameboard, coords?: Coordinates) {
        return this.isHuman && coords
            ? gameboard.receiveAttack(coords)
            : gameboard.receiveAttack(generateRandomCoordinates(gameboard))
    }

}

function generateRandomCoordinates (gameboard: Gameboard): Coordinates {
    const randomNumber = () => Math.floor(Math.random() * 10);
    const coords = {
        x: randomNumber(),
        y: randomNumber()
    };
    if (!isValidAttack(gameboard.receivedAttacks,coords)) return generateRandomCoordinates(gameboard);
    return coords;
}
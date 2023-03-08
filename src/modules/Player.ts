import Gameboard, { Coordinates } from './Gameboard'

export default class Player {

    name
    isHuman
    gameboard

    constructor (name: string, isHuman = true) {
        this.name = name
        this.isHuman = isHuman
        this.gameboard = new Gameboard
    }

    attack (gameboard: Gameboard, coords: Coordinates) {
        return this.isHuman
            ? gameboard.receiveAttack(coords)
            : gameboard.receiveAttack(generateRandomCoordinates())
    }

}

function generateRandomCoordinates () {
    const randomNumber = () => Math.floor(Math.random() * 10)
    return {
        x: randomNumber(),
        y: randomNumber()
    }
}
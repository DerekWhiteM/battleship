import Gameboard, { Coordinates, isValidAttack } from './Gameboard';

class Player {

    name;
    isHuman;
    gameboard;

    constructor (name: string, isHuman = true) {
        this.name = name;
        this.isHuman = isHuman;
        this.gameboard = new Gameboard;
    }

    attack (gameboard: Gameboard, coords?: Coordinates) {
        return this.isHuman && coords
            ? gameboard.receiveAttack(coords)
            : gameboard.receiveAttack(this.generateRandomCoordinates(gameboard));
    }

    private generateRandomCoordinates (gameboard: Gameboard): Coordinates {
        const randomNumber = () => Math.floor(Math.random() * 10);
        const coords = {
            x: randomNumber(),
            y: randomNumber()
        };
        if (!isValidAttack(gameboard.receivedAttacks,coords)) return this.generateRandomCoordinates(gameboard);
        return coords;
    }

}

export default Player;
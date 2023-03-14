import Ship from './Ship';
import type { ShipLocation } from './Ship';

type Attack = {
    coords: Coordinates,
    isHit: boolean
};

export type Coordinates = {
    x: number,
    y: number
};

export default class Gameboard {

    placedShips: Array<Ship> = [];
    receivedAttacks: Array<Attack> = [];

    isEveryShipSunk() {
        for (const placedShip of this.placedShips) {
            if (!placedShip.isSunk()) return false;
        }
        return true;
    }

    placeShip(ship: Ship) {
        this.placedShips.push(ship);
        return ship;
    }

    randomize(predefinedShips: Array<{ id: number, length: number }>) {
        for (const predefinedShip of predefinedShips) {
            const ship = new Ship(predefinedShip.id, predefinedShip.length);
            ship.location = this.generateRandomLocation(this, ship);
            this.placeShip(ship);
        }
    }

    receiveAttack(coords: Coordinates) {
        for (const ship of this.placedShips) {
            if (!ship.isHit(coords)) continue;
            ship.hit();
            this.receivedAttacks.push({ coords, isHit: true });
            return true;
        }
        this.receivedAttacks.push({ coords, isHit: false });
        return false;
    }

    isValidAttack(coords: Coordinates) {
        if (!(coords.x >= 0 && coords.x <= 9 && coords.y >=0 && coords.y <= 9)) return false;
        for (const receivedAttack of this.receivedAttacks) {
            if (JSON.stringify(receivedAttack.coords) === JSON.stringify(coords)) return false;
        }
        return true;
    }

    isValidLocation(location: ShipLocation) {
        if (!location) return false;
        const orientation = location?.start.y === location?.end.y
            ? 'horizontal'
            : 'vertical';
        const length = orientation === 'horizontal'
            ? location?.end.x - location?.start.x + 1
            : location?.end.y - location?.start.y + 1;
        for (let i = 0; i < length; i++) {
            const coords = orientation === 'horizontal'
                ? { x: location.start.x + i, y: location.start.y }
                : { x: location.start.x, y: location.start.y + i };
            if (!(coords.x >= 0 && coords.x <= 9 && coords.y >=0 && coords.y <= 9)) return false;
            for (const ship of this.placedShips) {
                if (ship.isHit(coords)) return false;
                if (ship.isBorder(coords)) return false;
            }
        }
        return true;
    }

    private generateRandomLocation (gameboard: Gameboard, ship: Ship): ShipLocation {
        const getRandomNumber = () => Math.floor(Math.random() * 10);
        const start = {
            x: getRandomNumber(),
            y: getRandomNumber()
        };
        const orientation = Math.random() >= .5 ? 'horizontal' : 'vertical';
        const end = orientation === 'horizontal'
            ? { x: start.x + ship.length - 1, y: start.y }
            : { x: start.x, y: start.y + ship.length - 1 };
        const randomLocation = { start, end };
        return gameboard.isValidLocation(randomLocation)
            ? randomLocation
            : this.generateRandomLocation(gameboard, ship);
    }

};
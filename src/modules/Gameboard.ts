import Ship from './Ship';
import type { ShipLocation } from './Ship';

class Gameboard {

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
        for (const placedShip of this.placedShips) {
            if (!isHit(placedShip, coords)) continue;
            placedShip.hit();
            this.receivedAttacks.push({ coords, isHit: true });
            return true;
        }
        this.receivedAttacks.push({ coords, isHit: false });
        return false;
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
                if (isHit(ship, coords)) return false;
                if (isBorder(ship, coords)) return false;
            }
        }
        return true;
    }

    private generateRandomLocation (gameboard: Gameboard, ship: Ship): ShipLocation {

        function getRandomNumber () {
            return Math.floor(Math.random() * 10);
        }
    
        const start = {
            x: getRandomNumber(),
            y: getRandomNumber()
        };
    
        const orientation = Math.random() >= .5
            ? 'horizontal'
            : 'vertical';
    
        const end = () => {
            if (orientation === 'horizontal') {
                return {
                    x: start.x + ship.length - 1,
                    y: start.y
                };
            } else {
                return {
                    x: start.x,
                    y: start.y + ship.length - 1
                };
            }
        };
    
        const randomLocation = {
            start,
            end: end()
        };
    
        if (gameboard.isValidLocation(randomLocation)) {
            return randomLocation;
        } else {
            return this.generateRandomLocation(gameboard, ship);
        }
    
    }

}

function isBorder (ship: Ship, coords: Coordinates) {
    if (!ship.location) return false;
    for (let i = 0; i < ship.length; i++) {
        const shipCoords = ship.orientation === 'horizontal'
            ? { x: ship.location.start.x + i, y: ship.location.start.y }
            : { x: ship.location.start.x, y: ship.location.start.y + i };
        const distance = getDistance(shipCoords, coords);
        if (distance >=1 && distance < 2) return true;
    }
    return false;
}

export function getDistance (coord1: Coordinates, coord2: Coordinates) {
    const xDiff = (coord2.x - coord1.x)**2;
    const yDiff = (coord2.y - coord1.y)**2;
    return Math.sqrt(xDiff + yDiff);
}

export function isHit (ship: Ship, coords: Coordinates) {
    if (!ship.location) return false;
    if (coords.x === ship.location.start.x && coords.x === ship.location.end.x) {
        return coords.y >= ship.location.start.y && coords.y <= ship.location.end.y;
    }
    if (coords.y === ship.location.start.y && coords.y === ship.location.end.y) {
        return coords.x >= ship.location.start.x && coords.x <= ship.location.end.x;
    }
    return false;
}

export function isValidAttack (receivedAttacks: Array<Attack>, coords: Coordinates) {
    if (!(coords.x >= 0 && coords.x <= 9 && coords.y >=0 && coords.y <= 9)) return false;
    for (const receivedAttack of receivedAttacks) {
        if (JSON.stringify(receivedAttack.coords) === JSON.stringify(coords)) return false;
    }
    return true;
}

export type Coordinates = {
    x: number,
    y: number
};

type Attack = {
    coords: Coordinates,
    isHit: boolean
};

export default Gameboard;
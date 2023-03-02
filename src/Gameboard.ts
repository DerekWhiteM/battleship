import Ship from './Ship'

export default class Gameboard {

    placedShips: Array<PlacedShip> = []
    receivedAttacks: Array<Attack> = []

    isEveryShipSunk() {
        for (const placedShip of this.placedShips) {
            if (!placedShip.ship.isSunk()) return false
        }
        return true
    }

    placeShip(length: number, location: ShipLocation) {
        const ship = new Ship(length)
        this.placedShips.push({ ship, location })
    }

    receiveAttack(coords: Coordinates) {
        if (!isValidAttack(this.receivedAttacks, coords)) return false
        for (const placedShip of this.placedShips) {
            if (!isHit(placedShip, coords)) continue
            placedShip.ship.hit()
            this.receivedAttacks.push({ coords, isHit: true })
            return true
        }
        this.receivedAttacks.push({ coords, isHit: false })
        return true
    }

}

function isHit (ship: PlacedShip, coords: Coordinates) {
    if (coords.x === ship.location.start.x && coords.x === ship.location.end.x) {
        return coords.y >= ship.location.start.y && coords.y <= ship.location.end.y
    }
    if (coords.y === ship.location.start.y && coords.y === ship.location.end.y) {
        return coords.x >= ship.location.start.x && coords.x <= ship.location.end.x
    }
    return false
}

function isValidAttack (receivedAttacks: Array<Attack>, coords: Coordinates) {
    if (!(coords.x >= 0 && coords.x <= 9 && coords.y >=0 && coords.y <= 9)) return false
    for (const receivedAttack of receivedAttacks) {
        if (JSON.stringify(receivedAttack.coords) === JSON.stringify(coords)) return false
    }
    return true
}

export type Coordinates = {
    x: number,
    y: number
}

type ShipLocation = {
    start: Coordinates,
    end: Coordinates
}

type PlacedShip = {
    ship: Ship,
    location: ShipLocation
}

type Attack = {
    coords: Coordinates,
    isHit: boolean
}
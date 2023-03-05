import Ship from './Ship'
import type { ShipLocation } from './Ship'

export default class Gameboard {

    placedShips: Array<Ship> = []
    receivedAttacks: Array<Attack> = []

    isEveryShipSunk() {
        for (const placedShip of this.placedShips) {
            if (!placedShip.isSunk()) return false
        }
        return true
    }

    placeShip(ship: Ship) {
        this.placedShips.push(ship)
        return ship
    }

    receiveAttack(coords: Coordinates) {
        for (const placedShip of this.placedShips) {
            if (!isHit(placedShip, coords)) continue
            placedShip.hit()
            this.receivedAttacks.push({ coords, isHit: true })
            return true
        }
        this.receivedAttacks.push({ coords, isHit: false })
        return false
    }

}

export function isHit (ship: Ship, coords: Coordinates) {
    if (!ship.location) return false
    if (coords.x === ship.location.start.x && coords.x === ship.location.end.x) {
        return coords.y >= ship.location.start.y && coords.y <= ship.location.end.y
    }
    if (coords.y === ship.location.start.y && coords.y === ship.location.end.y) {
        return coords.x >= ship.location.start.x && coords.x <= ship.location.end.x
    }
    return false
}

export function isValidAttack (receivedAttacks: Array<Attack>, coords: Coordinates) {
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

type Attack = {
    coords: Coordinates,
    isHit: boolean
}
import type { Coordinates } from "./Gameboard"

export default class Ship {

    length
    hits
    location

    constructor(length: number, location: ShipLocation = null) {
        this.length = length
        this.hits = 0
        this.location = location
    }

    isSunk () { return this.hits >= this.length }

    hit () { this.hits++ }

}

export type ShipLocation = {
    start: Coordinates,
    end: Coordinates
} | null
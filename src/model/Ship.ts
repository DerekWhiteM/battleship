import type { ShipLocation, Coordinates } from '../types';

export default class Ship {

    id;
    length;
    hits;
    location;

    constructor(id: number, length: number, location: ShipLocation = null) {
        this.id = id;
        this.length = length;
        this.hits = 0;
        this.location = location;
    }

    get orientation () {
        if (!this.location) return null;
        return this.location.start.y === this.location.end.y
            ? 'horizontal'
            : 'vertical';
    }

    hit () { this.hits++; }

    isSunk () { return this.hits >= this.length; }

    isBorder (coords: Coordinates) {
        if (!this.location) return false;
        for (let i = 0; i < this.length; i++) {
            const shipCoords = this.orientation === 'horizontal'
                ? { x: this.location.start.x + i, y: this.location.start.y }
                : { x: this.location.start.x, y: this.location.start.y + i };
            const distance = this.getDistance(shipCoords, coords);
            if (distance >=1 && distance < 2) return true;
        }
        return false;
    }

    isHit (coords: Coordinates) {
        if (!this.location) return false;
        if (coords.x === this.location.start.x && coords.x === this.location.end.x) {
            return coords.y >= this.location.start.y && coords.y <= this.location.end.y;
        }
        if (coords.y === this.location.start.y && coords.y === this.location.end.y) {
            return coords.x >= this.location.start.x && coords.x <= this.location.end.x;
        }
        return false;
    }

    private getDistance (coord1: Coordinates, coord2: Coordinates) {
        const xDiff = (coord2.x - coord1.x)**2;
        const yDiff = (coord2.y - coord1.y)**2;
        return Math.sqrt(xDiff + yDiff);
    }

};
export default class Ship {

    length: number
    hits: number

    constructor(length: number) {
        this.length = length
        this.hits = 0
    }

    isSunk () { return this.hits >= this.length }

    hit () { this.hits++ }

}
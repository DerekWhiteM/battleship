import Player from './Player'

export default class Game {

    player1
    player2
    turn
    isStarted = false

    constructor (player1: Player, player2: Player) {
        this.player1 = player1
        this.player2 = player2
        this.turn = player1
    }

    get winner () {
        if (!this.isStarted) return null
        if (this.player2.gameboard.isEveryShipSunk()) return this.player1
        if (this.player1.gameboard.isEveryShipSunk()) return this.player2
    }

    start() {
        return this.isStarted
            ? this.isStarted = false
            : this.isStarted = true
    }

    changeTurn() {
        if (this.turn === this.player1) {
            this.turn = this.player2
        } else {
            this.turn = this.player1
        }
    }

}
import Player from './Player'

export default class Game {

    player1
    player2
    isStarted = false

    constructor (player1: Player, player2: Player) {
        this.player1 = player1
        this.player2 = player2
    }

    get winner () {
        if (this.player2.gameboard.isEveryShipSunk()) return this.player1
        if (this.player1.gameboard.isEveryShipSunk()) return this.player2
    }

    get turn() {
        const sum1 = this.player1.gameboard.receivedAttacks.length
        const sum2 = this.player2.gameboard.receivedAttacks.length
        return (sum1 + sum2) % 2 === 0 
            ? this.player1
            : this.player2 
    }

    start () {
        this.isStarted = true
    }

}
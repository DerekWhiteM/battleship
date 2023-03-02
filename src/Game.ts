import Player from './Player'

export default class Game {

    player1
    player2

    constructor (player1: Player, player2: Player) {
        this.player1 = player1
        this.player2 = player2
    }

    isOver () {
        return this.player1.gameboard.isEveryShipSunk() || this.player2.gameboard.isEveryShipSunk()
    }

}
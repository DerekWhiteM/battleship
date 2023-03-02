const Game = require('../build/Game').default
const Player = require('../build/Player').default

test('Report whether or not the game is over', () => {
    const player1 = new Player('Player 1')
    const player2 = new Player('Player 2')
    const game = new Game(player1, player2)
    player1.gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    player2.gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    player1.attack(player2.gameboard, { x: 0, y: 0 })
    player2.attack(player1.gameboard, { x: 0, y: 0 })
    player1.attack(player2.gameboard, { x: 1, y: 0 })
    expect(game.isOver()).toBe(true)
})
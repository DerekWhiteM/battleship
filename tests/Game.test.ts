import Game from '../src/modules/Game'
import Player from '../src/modules/Player'
import Ship from '../src/modules/Ship'

test('Report whether or not the game is over', () => {
    const player1 = new Player('Player 1')
    const player2 = new Player('Player 2')
    const game = new Game(player1, player2)
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    player1.gameboard.placeShip(ship)
    player2.gameboard.placeShip(ship)
    player1.attack(player2.gameboard, { x: 0, y: 0 })
    player2.attack(player1.gameboard, { x: 0, y: 0 })
    player1.attack(player2.gameboard, { x: 1, y: 0 })
    expect(game.winner).toBe(player1)
})

test('Report whose turn it is', () => {
    const player1 = new Player('Player 1')
    const player2 = new Player('Player 2')
    const game = new Game(player1, player2)
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    player1.gameboard.placeShip(ship)
    player2.gameboard.placeShip(ship)
    player1.attack(player2.gameboard, { x: 0, y: 0 })
    player2.attack(player1.gameboard, { x: 0, y: 0 })
    expect(game.turn).toBe(player1)
})

test('Report if the game has started or not', () => {
    const player1 = new Player('Player 1')
    const player2 = new Player('Player 2')
    const game = new Game(player1, player2)
    expect(game.isStarted).toBe(false)
    game.start()
    expect(game.isStarted).toBe(true)
})
import Player from '../src/modules/Player'

test('Attack enemy gameboard', () => {
    const player1 = new Player('Player 1')
    const player2 = new Player('Player 2')
    player1.gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    jest.spyOn(player1.gameboard, 'receiveAttack')
    player2.attack(player1.gameboard, { x: 0, y: 0 })
    expect(player1.gameboard.receiveAttack).toHaveBeenCalledWith({ x: 0, y: 0 })
})
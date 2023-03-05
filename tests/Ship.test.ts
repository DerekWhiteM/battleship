import Ship from '../src/modules/Ship'

test('Hit', () => {
    const ship = new Ship(1, 5)
    ship.hit()
    expect(ship.hits).toEqual(1)
})

test('Sunk', () => {
    const ship = new Ship(1, 1)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})
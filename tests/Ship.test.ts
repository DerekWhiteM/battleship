import Ship from '../src/modules/Ship'

test('Hit', () => {
    const ship = new Ship(5)
    ship.hit()
    expect(ship).toEqual({
        length: 5,
        hits: 1
    })
})

test('Sunk', () => {
    const ship = new Ship(1)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})
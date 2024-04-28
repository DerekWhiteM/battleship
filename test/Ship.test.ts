import Ship from '../src/modules/Ship';

test('Hit', () => {
    const ship = new Ship(1, 5);
    ship.hit();
    expect(ship.hits).toEqual(1);
});

test('Sunk', () => {
    const ship = new Ship(1, 1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('Get orientation', () => {
    const ship = new Ship(1, 3, {
        start: { x: 0, y: 0 },
        end: { x: 2, y: 0 }
    });
    expect(ship.orientation).toBe('horizontal');
});
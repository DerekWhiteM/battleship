import Gameboard from '../src/modules/Gameboard';
import Ship from '../src/modules/Ship';

test('Place ships', () => {
    const gameboard = new Gameboard;
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    });
    gameboard.placeShip(ship);
    expect(gameboard.placedShips).toEqual([
        {
            id: 1,
            length: 2, 
            hits: 0,
            location: {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 }
            }
        }
    ]);
});

test('Receive attacks', () => {
    const gameboard = new Gameboard;
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    });
    gameboard.placeShip(ship);
    expect(gameboard.receiveAttack({ x: 0, y: 0 })).toBe(true);
    expect(gameboard.placedShips).toEqual([
        {
            id: 1,
            length: 2,
            hits: 1,
            location: {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 }
            }
        }
    ]);
    expect(gameboard.receivedAttacks).toEqual([
        {
            coords: { x: 0, y: 0 },
            isHit: true
        }
    ]);
});

test('Check for invalid attacks', () => {
    const gameboard = new Gameboard;
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    });
    gameboard.placeShip(ship);
    gameboard.receiveAttack({ x: 0, y: 0 });
    expect(gameboard.isValidAttack({ x: 0, y: 0 })).toBe(false);
    expect(gameboard.isValidAttack({ x: 0, y: 10 })).toBe(false);
});

test('Report whether all ships are sunk or not', () => {
    const gameboard = new Gameboard;
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    });
    gameboard.placeShip(ship);
    gameboard.receiveAttack({ x: 0, y: 0 });
    gameboard.receiveAttack({ x: 1, y: 0 });
    expect(gameboard.isEveryShipSunk()).toBe(true);
});

test('Return whether a location is valid', () => {
    const gameboard = new Gameboard;
    const ship = new Ship(1, 2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    });
    gameboard.placeShip(ship);
    expect(gameboard.isValidLocation({
        start: { x: 1, y: 0 },
        end: { x: 2, y: 0 }
    })).toBe(false);
});

test('Randomize ship placements', () => {
    const gameboard = new Gameboard;
    const ships = [
        {
            id: 1,
            name: "Carrier",
            length: 5
        },
        {
            id: 2,
            name: "Battleship",
            length: 4
        },
        {
            id: 3,
            name: "Destroyer",
            length: 3
        },
    ];
    gameboard.randomize(ships);
    expect(gameboard.placedShips).toHaveLength(3);
});
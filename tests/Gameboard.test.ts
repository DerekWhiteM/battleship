import Gameboard, { isValidAttack } from '../src/modules/Gameboard'

test('Place ships', () => {
    const gameboard = new Gameboard
    gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    expect(gameboard.placedShips).toEqual([
        {
            length: 2, 
            hits: 0,
            location: {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 }
            }
        }
    ])
})

test('Receive attacks', () => {
    const gameboard = new Gameboard
    gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    expect(gameboard.receiveAttack({ x: 0, y: 0 })).toBe(true)
    expect(gameboard.placedShips).toEqual([
        {
            length: 2,
            hits: 1,
            location: {
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 }
            }
        }
    ])
    expect(gameboard.receivedAttacks).toEqual([
        {
            coords: { x: 0, y: 0 },
            isHit: true
        }
    ])
})

test('Check for invalid attacks', () => {
    const gameboard = new Gameboard
    gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    gameboard.receiveAttack({ x: 0, y: 0 })
    expect(isValidAttack(gameboard.receivedAttacks, { x: 0, y: 0 })).toBe(false)
    expect(isValidAttack(gameboard.receivedAttacks, { x: 0, y: 10 })).toBe(false)
})

test('Report whether all ships are sunk or not', () => {
    const gameboard = new Gameboard
    gameboard.placeShip(2, {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 }
    })
    gameboard.receiveAttack({ x: 0, y: 0 })
    gameboard.receiveAttack({ x: 1, y: 0 })
    expect(gameboard.isEveryShipSunk()).toBe(true)
})
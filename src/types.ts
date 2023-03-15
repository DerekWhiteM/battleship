export type Attack = {
    coords: Coordinates,
    isHit: boolean
};

export type Coordinates = {
    x: number,
    y: number
};

export type DraggableShip = {
    id: number,
    length: number,
    location: ShipLocation,
    placingMode: 'horizontal' | 'vertical'
};

export type ShipLocation = {
    start: Coordinates,
    end: Coordinates
} | null;
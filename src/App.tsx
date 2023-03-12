import _ from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { isHit, isValidAttack } from './modules/Gameboard';
import { useDrag, useDrop } from 'react-dnd';
import { useState } from 'react';
import Game from './modules/Game';
import Player from './modules/Player';
import predefinedShips from './ships.json';
import Ship from './modules/Ship';

function App () {
    const player1 = new Player('Player 1');
    const player2 = new Player('Player 2', false);
    player2.gameboard.randomize(predefinedShips);
    const [ game, setGame ] = useState(new Game(player1, player2));
    return <DndProvider backend={HTML5Backend}>
        <div className="gameboards">
            <Gameboard player={game.player2} game={game} setGame={setGame} />
            <Gameboard player={game.player1} game={game} setGame={setGame} />
        </div>
        { game.winner && <GameOverScreen game={game} setGame={setGame} /> }
    </DndProvider>;
}

function Gameboard(props: { 
    game: Game, 
    player: Player, 
    setGame: Function 
}) {
    const { player, game, setGame } = props;
    const [currentShip, setCurrentShip] = useState<Ship>(new Ship(1, 5));
    const [placingMode, setPlacingMode] = useState('horizontal');
    const refreshGame = (newGame?: Game) => {
        setGame((prevState: Game) => newGame ? _.cloneDeep(newGame) : _.cloneDeep(prevState));
    };
    const startGame = () => {
        if (game.player1.gameboard.placedShips.length === game.player2.gameboard.placedShips.length) {
            game.start();
            refreshGame();
        }
    };
    return (
        <div className="gameboard">
            <h2 className="gameboard__title">{player.isHuman ? "Your board" : "Enemy's board"}</h2>
            <div className="gameboard__grid">
                { 
                    (!player.isHuman && !game.isStarted) &&
                    <>
                        <div className="gameboard__blur"></div>
                        <button className="gameboard__startButton" onClick={startGame}>Start</button>
                    </>
                }
                <TileGrid 
                    game={game} 
                    player={player} 
                    refreshGame={refreshGame} 
                    setCurrentShip={setCurrentShip} 
                    setPlacingMode={setPlacingMode} 
                />
            </div>
            {
                (player.isHuman && !game.isStarted) &&
                <UserControls 
                    currentShip={currentShip} 
                    placingMode={placingMode} 
                    player={player} 
                    refreshGame={refreshGame} 
                    setCurrentShip={setCurrentShip} 
                    setPlacingMode={setPlacingMode} 
                />
            }
        </div>
    );
}

function TileGrid(props: { 
    game: Game, 
    player: Player, 
    refreshGame: Function 
    setCurrentShip: Function, 
    setPlacingMode: Function, 
}) {
    const { player, setPlacingMode, setCurrentShip, game, refreshGame } = props;
    const elements = [];
    let count = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const placedShip = player.gameboard.placedShips.find(placedShip => isHit(placedShip, { x: j, y: i }));
            const receivedAttack = player.gameboard.receivedAttacks.find(attack => JSON.stringify(attack.coords) === JSON.stringify({ x: j, y: i }));
            const orientation = placedShip?.location?.start.y === placedShip?.location?.end.y
                ? 'horizontal'
                : 'vertical';
            const indexOfShip = () => {
                if (!placedShip?.location) return null;
                if (orientation === 'horizontal') {
                    return j - placedShip.location.start.x;
                } else {
                    return i - placedShip.location.start.y;
                }
            };
            const className = () => {
                if (!placedShip || (!player.isHuman && !placedShip.isSunk())) return 'gameboard__grid__item';
                if (orientation === 'horizontal') {
                    if (indexOfShip() === 0) return 'gameboard__grid__item--ship-h-first';
                    if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-h-last';
                    else return 'gameboard__grid__item--ship-h-middle';
                }
                else {
                    if (indexOfShip() === 0) return 'gameboard__grid__item--ship-v-first';
                    if (indexOfShip() === placedShip.length - 1) return 'gameboard__grid__item--ship-v-last';
                    else return 'gameboard__grid__item--ship-v-middle';
                }
            };

            const attackModifer = () => {
                if (!receivedAttack) return '';
                return receivedAttack.isHit ? ' hit' : ' miss';
            };

            elements.push(<Tile 
                className={className() + attackModifer()} 
                key={count} 
                x={j} 
                y={i}
                player={player}
                setPlacingMode={setPlacingMode}
                setCurrentShip={setCurrentShip}
                game={game}
                refreshGame={refreshGame}
            ></Tile>);
            count++;
        }
    }
    return <>{elements}</>;
}

function Tile(props: { 
    className: string, 
    game: Game, 
    player: Player, 
    refreshGame: Function 
    setCurrentShip: Function, 
    setPlacingMode: Function, 
    x: number, 
    y: number, 
}) {
    const { className, game, player, refreshGame, setCurrentShip, setPlacingMode, x, y, } = props;
    const handleClick = async (e: any) => {
        const coords = {
            x: Number(e.target.dataset.x),
            y: Number(e.target.dataset.y)
        };
        if (game.turn !== player && isValidAttack(player.gameboard.receivedAttacks, coords)) {
            const attack = player.gameboard.receiveAttack(coords);
            refreshGame(game);
            if (!attack) {
                game.changeTurn();
                makeAutomatedMovesRec();
            }
            async function makeAutomatedMovesRec(): Promise<any> {
                const timeout = new Promise(resolve => setTimeout(resolve, 500));
                await timeout;
                const attack = game.player2.attack(game.player1.gameboard);
                refreshGame(game);
                if (attack) return makeAutomatedMovesRec();
                game.changeTurn();
                refreshGame(game);
            }
        }
    };
    const handleDrop = (item: any, monitor: any) => {
        const location = getDropLocation();
        if ((location.start.x < 0 || location.end.x > 9) || (location.start.y < 0 || location.end.y > 9)) return alert('Invalid location');

        item.location = location;
        player.gameboard.placeShip(item);

        const nextPredefinedShip = predefinedShips.find(el => el.id === Number(item.id) + 1);

        if (nextPredefinedShip) {
            const nextShip = new Ship(nextPredefinedShip.id, nextPredefinedShip.length);
            if (nextShip) {
                setPlacingMode('horizontal');
                setCurrentShip(nextShip);
            }
        }

        if (!nextPredefinedShip) {
            const ship = document.getElementsByClassName('ship')[0] as HTMLElement;
            if (!ship) return;
            ship.style.display = 'none';
        }

        function getDropLocation() {
            const initialClientOffset = monitor.getInitialClientOffset();
            const initialSourceClientOffset = monitor.getInitialSourceClientOffset();
            const index = item.placingMode === 'horizontal'
                ? Math.ceil((initialClientOffset.x - initialSourceClientOffset.x) / 48) - 1
                : Math.ceil((initialClientOffset.y - initialSourceClientOffset.y) / 48) - 1;
            const horizontalLocation = {
                start: { x: x - index, y },
                end: { x: x - index + item.length - 1, y }
            };
            const verticalLocation = {
                start: { x, y: y - index },
                end: { x, y: y - index + item.length - 1 }
            };
            return item.placingMode === 'horizontal'
                ? horizontalLocation
                : verticalLocation;
        }
    };
    const [ collectProps, drop ] = useDrop(() => ({ accept: 'ship', drop: handleDrop }));
    return <div className={className} data-x={x} data-y={y} onClick={handleClick} ref={drop}></div>;
}

function UserControls(props: { 
    currentShip: Ship, 
    placingMode: string, 
    player: Player, 
    refreshGame: Function 
    setCurrentShip: Function, 
    setPlacingMode: Function,
}) {
    const { currentShip, placingMode, player, refreshGame,setCurrentShip, setPlacingMode } = props;
    return <>
        <div className="gameboard__controls">
            <button className="gameboard__controls__button" onClick={() => {
                const ship = document.getElementsByClassName('ship')[0] as HTMLElement;
                if (!ship) return;
                ship.style.display = 'none';
                player.gameboard.placedShips = [];
                player.gameboard.randomize(predefinedShips);
                refreshGame();
            }}>Randomize</button>
            <button className="gameboard__controls__button" onClick={() => {
                player.gameboard.placedShips = [];
                refreshGame();
                const predefinedShip = predefinedShips[0];
                const ship = new Ship(predefinedShip.id, predefinedShip.length);
                setCurrentShip(ship);
                setPlacingMode('horizontal');
                const shipElement = document.getElementsByClassName('ship')[0] as HTMLElement;
                shipElement.style.display = 'grid';
            }}>Reset</button>
        </div>
        <PlaceableShip id={String(currentShip.id)} length={currentShip.length} placingMode={placingMode} setPlacingMode={setPlacingMode} />
    </>;
}

function PlaceableShip (props: { 
    id: string, 
    length: number, 
    placingMode: string, 
    setPlacingMode: Function,
}) {
    const { id, length, placingMode, setPlacingMode } = props;
    const [ collectProps, drag ] = useDrag(() => ({
        type: 'ship',
        item: { id, length, placingMode }
    }), [id, length, placingMode]);
    const horizontalStyle = {
        display: 'grid',
        gridTemplateRows: 'calc(3rem - 2px)',
        gridTemplateColumns: `repeat(${length}, calc(3rem - 2px) )`,
        width: 'fit-content'
    };
    const verticalStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${length}, calc(3rem - 2px) )`,
        gridTemplateColumns: 'calc(3rem - 2px)',
        width: 'fit-content'
    };
    const style = () => placingMode === 'horizontal' ? horizontalStyle : verticalStyle;
    const handleClick = (e: any) => {
        if (placingMode === 'horizontal') {
            e.target.style.gridTemplateRows = `repeat(${length}, calc(3rem - 2px) )`;
            e.target.style.gridTemplateColumns = 'calc(3rem - 2px)';
            setPlacingMode('vertical');
        } else {
            e.target.style.gridTemplateRows = 'calc(3rem - 2px)';
            e.target.style.gridTemplateColumns = `repeat(${length}, calc(3rem - 2px) )`;
            setPlacingMode('horizontal');
        }
    }
    return <div id={id} className="ship" style={style()} ref={drag} onClick={handleClick}></div>;
}

function GameOverScreen (props: { 
    game: Game, 
    setGame: Function
}) {
    const { game, setGame } = props;
    const message = () => game.winner === game.player1
        ? 'You win!'
        : 'Computer wins!';
    const handleClick = () => {
        const player1 = new Player('Player 1');
        const player2 = new Player('Player 2', false);
        player2.gameboard.randomize(predefinedShips);
        setGame(new Game(player1, player2));
    }
    return (
        <div className="overlay">
            <h1 className="overlay__message">{message()}</h1>
            <button className="overlay__button" onClick={handleClick}>Play again</button>
        </div>
    );
}

export default App;
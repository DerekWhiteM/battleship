export default function Gameboard () {
    return (
        <div className="gameboard">
            <Tiles />
        </div>
    )
}

function Tiles () {
    let elements = []
    let count = 0
    for (let i = 0; i < 10; i++) {
        for (let j =0; j < 10; j++) {
            elements.push(<div className="gameboard__tile" key={count} data-x={j} data-y={i} onClick={handleClick}></div>)
            count++
        }
    }
    return <>{elements}</>
    function handleClick (e: any) {
        console.log(e.target.dataset.x, e.target.dataset.y)
    }
}
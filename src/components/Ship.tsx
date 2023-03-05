import { useDrag } from 'react-dnd'

// When click to drag, determine which index of the ship was clicked
export default function Ship (props: { id: string, length: number, placingMode: string, setPlacingMode: Function }) {
    const { id, length, placingMode, setPlacingMode } = props
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'ship',
        item: { 
            id, 
            length
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging()
        })
    }))
    const horizontalStyle = {
        display: 'grid',
        gridTemplateRows: 'calc(3rem - 2px)',
        gridTemplateColumns: `repeat(${length}, calc(3rem - 2px) )`,
        width: 'fit-content'
    }
    const verticalStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${length}, calc(3rem - 2px) )`,
        gridTemplateColumns: 'calc(3rem - 2px)',
        width: 'fit-content'
    }
    const style = () => placingMode === 'horizontal' ? horizontalStyle : verticalStyle
    return <div id={id} className="ship" style={style()} ref={drag} onClick={handleClick}></div>
    function handleClick(e: any) {
        if (placingMode === 'horizontal') {
            e.target.style.gridTemplateRows = `repeat(${length}, calc(3rem - 2px) )`
            e.target.style.gridTemplateColumns = 'calc(3rem - 2px)'
            setPlacingMode('vertical')
        } else {
            e.target.style.gridTemplateRows = 'calc(3rem - 2px)'
            e.target.style.gridTemplateColumns = `repeat(${length}, calc(3rem - 2px) )`
            setPlacingMode('horizontal')
        }
    }
}
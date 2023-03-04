import { useDrag } from 'react-dnd'

// When click to drag, determine which index of the ship was clicked
export default function Ship (props: { id: string, length: number }) {
    const { id, length } = props
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
    const style = {
        display: 'grid',
        gridTemplateRows: '3rem',
        gridTemplateColumns: `repeat(${length}, 3rem)`,
        width: 'fit-content'
    }
    return <div id={id} className="ship" style={style} ref={drag}></div>
}
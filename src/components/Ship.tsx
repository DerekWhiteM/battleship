import { useDrag } from 'react-dnd';

type Props = {
    id: string, 
    length: number, 
    placingMode: string, 
    setPlacingMode: Function
};

function Ship (props: Props) {
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
    const style = placingMode === 'horizontal' ? horizontalStyle : verticalStyle;
    const rotate = (e: any) => {
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
    return <div id={id} className="ship" style={style} ref={drag} onClick={rotate}></div>;
}

export default Ship;
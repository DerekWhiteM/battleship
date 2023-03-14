import { useDrag } from 'react-dnd';

type Props = {
    id: string, 
    length: number, 
    placingMode: string, 
    setPlacingMode: Function
};

export default function Ship (props: Props) {
    const { id, length, placingMode, setPlacingMode } = props;
    const [ collectProps, drag ] = useDrag(() => ({
        type: 'ship',
        item: { id, length, placingMode }
    }), [id, length, placingMode]);
    const horizontalStyle = {
        display: 'grid',
        gridTemplateRows: 'calc(2.85rem)',
        gridTemplateColumns: `repeat(${length}, calc(2.955rem))`,
        width: 'fit-content'
    };
    const verticalStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${length}, calc(3rem - 1px))`,
        gridTemplateColumns: 'calc(3rem - 1px)',
        width: 'fit-content'
    };
    const style = placingMode === 'horizontal' ? horizontalStyle : verticalStyle;
    const rotate = (e: any) => {
        if (placingMode === 'horizontal') {
            e.target.style.gridTemplateRows = `repeat(${length}, calc(3rem - 1px) )`;
            e.target.style.gridTemplateColumns = 'calc(3rem - 1px)';
            setPlacingMode('vertical');
        } else {
            e.target.style.gridTemplateRows = 'calc(3rem - 1px)';
            e.target.style.gridTemplateColumns = `repeat(${length}, calc(3rem - 1px) )`;
            setPlacingMode('horizontal');
        }
    }
    return <div id={id} className="ship" style={style} ref={drag} onClick={rotate}></div>;
};
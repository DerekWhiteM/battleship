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

    const horizontalGrid = {
        gridTemplateRows: 'calc(2.85rem)',
        gridTemplateColumns: `repeat(${length}, calc(2.955rem))`
    };

    const verticalGrid = {
        gridTemplateRows: `repeat(${length}, calc(2.955rem))`,
        gridTemplateColumns: 'calc(2.85rem)',
    };

    const gridTemplate = placingMode === 'horizontal'
        ? horizontalGrid
        : verticalGrid;

    const rotate = (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement;
        if (placingMode === 'horizontal') {
            target.style.gridTemplateRows = verticalGrid.gridTemplateRows;
            target.style.gridTemplateColumns = verticalGrid.gridTemplateColumns;
            setPlacingMode('vertical');
        } else {
            target.style.gridTemplateRows = horizontalGrid.gridTemplateRows;
            target.style.gridTemplateColumns = horizontalGrid.gridTemplateColumns;
            setPlacingMode('horizontal');
        }
    };

    return <div id={id} className="ship" style={gridTemplate} ref={drag} onClick={rotate}></div>;

};
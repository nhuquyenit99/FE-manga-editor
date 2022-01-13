import React, { useContext, useEffect } from 'react';
import { Button, InputNumber, Popover } from 'antd';
import './style.scss';
import { EraserContext } from '../../context';
import { SketchPicker } from 'react-color';
import { getColorStrFromRgba, getRgbaFromString } from '../../utils';

export const EraseMenu = () => {
    const { 
        brushWidth, color, 
        onClearAll, onUndo, 
        setBrushWidth, setColor 
    } = useContext(EraserContext);
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ EraseMenu ~ onUndo', onUndo);

    const onUndoViaKeyDown = (e: KeyboardEvent) => {
        console.log('🚀 ~ file: index.tsx ~ line 17 ~ onUndoViaKeyDown ~ e.ctrlKey && e.key === \'z\'', e.ctrlKey && e.key === 'z');
        if (e.ctrlKey && e.key === 'z') {
            onUndo();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onUndoViaKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[onUndo]);

    return (
        <div className='erase-menu-sidebar'>
            <div className='splitter'/>
            <div className='menu'>
                <h3>Eraser Width</h3>
                <div>
                    <InputNumber min={1} 
                        value={brushWidth}
                        onChange={setBrushWidth}
                        className='select-eraser-width'
                    />
                </div>
                <h3>Color</h3>
                <Popover 
                    trigger='click'
                    placement='rightBottom'
                    overlayClassName='pick-color-overlay'
                    content={<SketchPicker color={getRgbaFromString(color) as any} 
                        onChange={color => setColor(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                    <div style={{
                        background: color,
                        border: '5px solid white',
                        width: '100px',
                        height: '30px',
                        cursor: 'pointer'
                    }}>
                    </div>
                </Popover>
                <h3>Action</h3>
                <div className='menu-action'>
                    <Button onClick={onUndo}>Undo</Button>
                    <Button type='primary' onClick={onClearAll}>Clear All</Button>
                </div>

            </div>
        </div>
    );
};


import React, { useContext, useRef } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { ImageContext } from '../../context';
import { Cordinate, TextBoxData } from '../../model';
import './style.scss';
import _ from 'lodash';

type TextBoxProps = {
    data: TextBoxData
    draggable?: boolean
}

export const TextBox = ({data, draggable = true}: TextBoxProps) => {
    const { setActiveId, removeTextBox, setTextBoxs } = useContext(ImageContext);
    const defaultValue = useRef(data.text);

    const onUpdateTextBox = (newData: Cordinate) => {
        setTextBoxs(prev => {
            return {
                ...prev,
                [data.id]: {
                    ...data,
                    coordinates: newData
                }
            };
        });
    };

    const onChangeText = (e: any) => {
        const value =  e.currentTarget.innerHTML;
        console.log('🚀 ~ file: index.tsx ~ line 32 ~ _.debounce ~ value', value);
        setTextBoxs(prev => {
            return {
                ...prev,
                [data.id]: {
                    ...data,
                    text: value
                }
            };
        });
    };

    return (
        <Rnd
            default={data.coordinates}
            disableDragging={!draggable}
            onDragStop={(e, dt) => {
                onUpdateTextBox({
                    ...data.coordinates,
                    x: dt.x,
                    y: dt.y,
                });
            }}
            onResizeStop={(e, dir, element, delta, pos) => {
                onUpdateTextBox({
                    ...data.coordinates,
                    width: Number.parseFloat(element.style.width),
                    height: Number.parseFloat(element.style.height),
                });
            }}
            bounds="parent"
            className='text-input draggable'
        >
            <div 
                style={data.style}
                className='text-editable' 
                contentEditable
                onClick={(e) => {
                    setActiveId(data.id);
                    let range = document.createRange();
                    range.selectNodeContents(e.target as any);
                    let sel = window.getSelection()!;
                    sel.removeAllRanges();
                    sel.addRange(range);
                }}
                onInput={onChangeText} 
                data-placeholder="Enter something..."
                dangerouslySetInnerHTML={{__html: defaultValue.current}}
            >
            </div>
            <CloseCircleOutlined className='btn-delete' onClick={() => removeTextBox(data.id)}/>
        </Rnd>
    );
};
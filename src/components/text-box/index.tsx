import React, { useContext } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { TextBoxContext } from '../../context';
import { TextBoxData } from '../../model';
import './style.scss';

type TextBoxProps = {
    data: TextBoxData
}

export const TextBox = ({data}: TextBoxProps) => {
    const { setActiveId, removeTextBox } = useContext(TextBoxContext);
    return (
        <Rnd
            default={data.coordinates}
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
            >
                Type something...
            </div>
            <CloseCircleOutlined className='btn-delete' onClick={() => removeTextBox(data.id)}/>
        </Rnd>
    );
};
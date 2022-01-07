import React, { useContext } from 'react';
import { Rnd } from 'react-rnd';
import { TextBoxActiveContext } from '../../context';
import { TextBoxData } from '../../model';
import './style.scss';

type TextBoxProps = {
    data: TextBoxData,
}


export const TextBox = ({data}: TextBoxProps) => {
    const { setActiveId } = useContext(TextBoxActiveContext);
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
                onClick={() => setActiveId(data.id)}
            >
                New Text
            </div>
        </Rnd>
    );
};
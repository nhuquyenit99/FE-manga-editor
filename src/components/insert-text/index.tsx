import React from 'react';
import { Rnd } from 'react-rnd';
import { Button } from 'antd';
import './style.scss';

const defaultSrc =
  'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';

export const InsertTextPanel = () => {
    return (
        <div className='insert-text-panel-wrapper'>
            <div className='header'>
                <div className='title'>Insert Text</div>  
            </div>
            <div className='insert-text-panel'>
                <div className='workspace'>
                    <div className='image-to-edit'>
                        <img src={defaultSrc} alt='img-to-edit'/>
                        <TextBox />
                        {/* <input placeholder='Enter something...' className='text-input'/> */}
                    </div>
                </div>
                
                <div className='tool-menu'>
                    <Button type='primary' shape='round'>Save</Button>
                    <Button shape='round'>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export const TextBox = () => {
    return (
        <Rnd
            default={{
                x: 100,
                y: 100,
                width: 200,
                height: 200,
            }}
            bounds="parent"
            className='text-input draggable'
        >
            <div 
                className='text-editable' 
                contentEditable
            >
                        Enter something...
            </div>
        </Rnd>
    );
};
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from 'antd';
import './style.scss';

const defaultSrc = require('https://github.com/nhuquyenit99/manga-editor/blob/master/src/assets/011.jpg');

export const InsertTextPanel = () => {
    return (
        <div className='insert-text-panel-wrapper'>
            <div className='header'>
                <div className='title'>Insert Text</div>  
            </div>
            <div className='insert-text-panel'>
                <div className='tool-menu'>
                    <Button type='primary' shape='round'>Save</Button>
                    <Button shape='round'>Cancel</Button>
                </div>
                <div className='workspace'>
                    <div className='image-to-edit'>
                        <img src={defaultSrc} alt='img-to-edit'/>
                        <TextBox />
                        {/* <input placeholder='Enter something...' className='text-input'/> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export type TextBoxRef = {
    setBackground: (background?: string) => void
    setTextColor: (textColor?: string) => void
    setFontSize: (fontSize?: string) => void
    setFontFamily: (fontFamily?: string) => void
    setBold: (isBold: boolean) => void
    setItalic: (isBold: boolean) => void
    setUnderline: (isBold: boolean)  => void
    setLineThrough: (isBold: boolean) => void
}

export const TextBox = forwardRef((props, ref) => {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const onSetBackGround = (background?: string) => {
        setStyle(prev => {
            return {
                ...prev, 
                background: background
            };
        });
    };
    const onSetFontSize = (fontSize?: string) => {
        setStyle(prev => {
            return {
                ...prev,
                fontSize: fontSize
            };
        });
    };

    const onSetTextColor = (textColor?: string) => {
        setStyle(prev => {
            return {
                ...prev, 
                color: textColor
            };
        });
    };
    
    const onSetFontFamility = (fontFamily?: string) => {
        setStyle(prev => {
            return {
                ...prev,
                fontFamily: fontFamily
            };
        });
    };

    const onSetTextBold = (isBold: boolean = false) => {
        setStyle(prev => {
            return {
                ...prev,
                fontWeight: isBold ? 'bold' : 'normal'
            };
        });
    };

    const onSetTextItalic = (isItalic: boolean = false) => {
        setStyle(prev => {
            return {
                ...prev, 
                fontStyle: isItalic ? 'italic' : 'normal'
            };
        });
    };

    const onSetTextUnderline = (isUnderline: boolean = false) => {
        setStyle(prev => {
            return {
                ...prev, 
                textDecoration: isUnderline ? 'underline' : 'normal'
            };
        });
    };

    const onSetTextLineThrough = (isLineThrough: boolean = false) => {
        setStyle(prev => {
            return {
                ...prev, 
                textDecoration: isLineThrough ? 'line-through' : 'normal'
            };
        });
    };

    useImperativeHandle(ref, () => ({
        setBackground: onSetBackGround,
        setTextColor: onSetTextColor,
        setFontSize: onSetFontSize,
        setFontFamily: onSetFontFamility,
        setBold: onSetTextBold,
        setItalic: onSetTextItalic,
        setUnderline: onSetTextUnderline,
        setLineThrough: onSetTextLineThrough
    }));

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
                style={style}
                className='text-editable' 
                contentEditable
            >
                Enter something...
            </div>
        </Rnd>
    );
});
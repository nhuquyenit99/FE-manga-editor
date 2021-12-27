import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Popover, InputNumber } from 'antd';
import { RGBColor, SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBold, faItalic, faUnderline, faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import { Rnd } from 'react-rnd';
import { Button } from 'antd';
import './style.scss';

const defaultSrc = 'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';

const getRgbaFromString = (colorStr?: string) => {
    if (!colorStr) {
        return undefined;
    }
    const splittedStr = colorStr.split(',');
    return {
        r: splittedStr[0]?.slice(5),
        g: splittedStr[1],
        b: splittedStr[2],
        a: splittedStr[3].slice(0, splittedStr[3].length - 1)
    };
};

const getColorStrFromRgba = (color: RGBColor) => {
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

export const InsertTextPanel = () => {
    const [style, setStyle] = useState<React.CSSProperties>({
        background: 'rgba(255, 255, 255, 0.667)',
        color: 'rgba(20,20,20,1)',
        fontSize: '14px'
    });
    const onSetBackGround = (background?: string) => {
        setStyle(prev => {
            return {
                ...prev, 
                background: background
            };
        });
    };
    const onSetFontSize = (fontSize?: number) => {
        setStyle(prev => {
            return {
                ...prev,
                fontSize: `${fontSize}px`
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

    const onToggleSetTextBold = () => {
        setStyle(prev => {
            return {
                ...prev,
                fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold'
            };
        });
    };

    const onToggleSetTextItalic = () => {
        setStyle(prev => {
            return {
                ...prev, 
                fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic'
            };
        });
    };

    const onToggleSetTextUnderline = () => {
        setStyle(prev => {
            return {
                ...prev, 
                textDecoration: prev.textDecoration === 'underline' ?  'none' : 'underline'
            };
        });
    };

    const onToggleSetTextLineThrough = () => {
        setStyle(prev => {
            return {
                ...prev, 
                textDecoration: prev.textDecoration === 'line-through' ? 'none' : 'line-through'
            };
        });
    };
    return (
        <div className='insert-text-panel-wrapper'>
            <div className='header'>
                <div className='title'>Insert Text</div>  
            </div>
            <div className='insert-text-panel'>
                <div className='text-tool-menu'>
                    <h3>Text Style</h3>
                    <div className='style-menu'>
                        <Button className='style-btn' key='bold' 
                            type={style.fontWeight === 'bold' ? 'primary' : undefined} 
                            onClick={onToggleSetTextBold}>
                            <FontAwesomeIcon icon={faBold}/>
                        </Button>
                        <Button className='style-btn' key='italic'
                            type={style.fontStyle === 'italic' ? 'primary' : undefined}
                            onClick={onToggleSetTextItalic}>
                            <FontAwesomeIcon icon={faItalic}/>
                        </Button>
                        <Button className='style-btn' key='underline'
                            type={style.textDecoration === 'underline' ? 'primary' : undefined}
                            onClick={onToggleSetTextUnderline}
                        >
                            <FontAwesomeIcon icon={faUnderline}/>
                        </Button>
                        <Button className='style-btn' key='line-through'
                            type={style.textDecoration === 'line-through' ? 'primary' : undefined}
                            onClick={onToggleSetTextLineThrough}
                        >
                            <FontAwesomeIcon icon={faStrikethrough}/>
                        </Button>
                    </div>
                    <h3>Text Color</h3>
                    <Popover 
                        trigger='click'
                        placement='rightBottom'
                        overlayClassName='pick-color-overlay'
                        content={<SketchPicker color={getRgbaFromString(style.color) as any} 
                            onChange={color => onSetTextColor(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                        <div style={{
                            background: style.color,
                            border: '5px solid white',
                            width: '100px',
                            height: '30px',
                            cursor: 'pointer'
                        }}>
                        </div>
                    </Popover>
                    <h3>Background Color</h3>
                    <Popover 
                        trigger='click'
                        placement='rightBottom'
                        overlayClassName='pick-color-overlay'
                        content={<SketchPicker color={getRgbaFromString(style.background as any) as any} 
                            onChange={color => onSetBackGround(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                        <div style={{
                            background: style.background,
                            border: '5px solid white',
                            width: '100px',
                            height: '30px',
                            cursor: 'pointer'
                        }}>
                        </div>
                    </Popover>
                    <h3>Font Size</h3>
                    <div>
                        <InputNumber min={1} 
                            value={Number.parseInt((style.fontSize as string).slice(0,(style.fontSize as string).length - 2 ))}
                            onChange={onSetFontSize}
                            className='select-font-size'
                        />
                    </div>

                    <Button type='primary' shape='round' className='btn-save'>Save</Button>
                </div>
                <div className='workspace'>
                    <div className='image-to-edit'>
                        <img src={defaultSrc} alt='img-to-edit'/>
                        <TextBox style={style}/>
                        {/* <input placeholder='Enter something...' className='text-input'/> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// export type TextBoxRef = {
//     setBackground: (background?: string) => void
//     setTextColor: (textColor?: string) => void
//     setFontSize: (fontSize?: string) => void
//     setFontFamily: (fontFamily?: string) => void
//     setBold: (isBold: boolean) => void
//     setItalic: (isBold: boolean) => void
//     setUnderline: (isBold: boolean)  => void
//     setLineThrough: (isBold: boolean) => void
// }

type TextBoxProps = {
    style: React.CSSProperties
}

export const TextBox = ({style}: TextBoxProps) => {
   

    // useImperativeHandle(ref, () => ({
    //     setBackground: onSetBackGround,
    //     setTextColor: onSetTextColor,
    //     setFontSize: onSetFontSize,
    //     setFontFamily: onSetFontFamility,
    //     setBold: onSetTextBold,
    //     setItalic: onSetTextItalic,
    //     setUnderline: onSetTextUnderline,
    //     setLineThrough: onSetTextLineThrough
    // }));

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
};
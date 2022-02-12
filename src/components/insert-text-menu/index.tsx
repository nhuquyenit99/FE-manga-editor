import React, { useContext } from 'react';
import uniqid from 'uniqid';
import { SketchPicker } from 'react-color';
import { Button, Select, Popover, InputNumber } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBold, faItalic, faUnderline, faStrikethrough, faFont
} from '@fortawesome/free-solid-svg-icons';

import { defaultCordinate, defaultTextBoxStyle, ListFontFamily } from '../../model';
import { getColorStrFromRgba, getRgbaFromString, getSizeFromPixel } from '../../utils';
import { ImageContext } from '../../context';
import './style.scss';

export const InsertTextPanel = () => {
    const { activeIds, setTextBoxs, textBoxs, currentPage } = useContext(ImageContext);

    const onAddText = () => {
        const id = uniqid();
        setTextBoxs(prev => {
            return {
                ...prev,
                [id]: {
                    id: id,
                    coordinates: {
                        ...defaultCordinate,
                        x: defaultCordinate.x + Object.keys(textBoxs).length * 10,
                        y: defaultCordinate.y + Object.keys(textBoxs).length * 10,
                    },
                    style: {...defaultTextBoxStyle},
                    page: currentPage,
                    text: ''
                }
            };
        });
    };

    const updateActiveTextBoxStyle = (style: React.CSSProperties) => {
        let newTextBoxData = {...textBoxs};
        for (let id of activeIds) {
            newTextBoxData[id] = {
                ...newTextBoxData[id],
                style: {
                    ...newTextBoxData[id].style,
                    ...style
                }
            };
        }
        setTextBoxs(newTextBoxData);
    };

    const onSetBackGround = (background?: string) => {
        const newStyle = {
            background: background
        };
        updateActiveTextBoxStyle(newStyle);
    };
    const onSetFontSize = (fontSize?: number) => {
        const newStyle = {
            fontSize: `${fontSize}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onSetBorderRadius = (borderRadius?: number) => {
        const newStyle = {
            borderRadius: `${borderRadius}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };


    const onSetTextColor = (textColor?: string) => {
        const newStyle = {
            color: textColor
        };
        updateActiveTextBoxStyle(newStyle);
    };
    
    const onSetFontFamily = (fontFamily?: string) => {
        const newStyle = {
            fontFamily: fontFamily
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const isBold = () => {
        if (activeIds.length === 0) return false;
        for (let id of activeIds) {
            if (textBoxs[id]?.style?.fontWeight !== 'bold') {
                return false;
            }
        }
        return true;
    };

    const onToggleSetTextBold = () => {
        const newStyle = {
            fontWeight: isBold() ? 'normal' : 'bold'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const isItalic = () => {
        if (activeIds.length === 0) return false;
        for (let id of activeIds) {
            if (textBoxs[id]?.style?.fontStyle !== 'italic') {
                return false;
            }
        }
        return true;
    };

    const onToggleSetTextItalic = () => {
        const newStyle = {
            fontStyle: isItalic() ? 'normal' : 'italic'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const isUnderline = () => {
        if (activeIds.length === 0) return false;
        for (let id of activeIds) {
            if (textBoxs[id]?.style?.textDecoration !== 'underline') {
                return false;
            }
        }
        return true;
    };

    const onToggleSetTextUnderline = () => {

        const newStyle = {
            textDecoration: isUnderline() ?  'none' : 'underline'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const isLineThrough = () => {
        if (activeIds.length === 0) return false;
        for (let id of activeIds) {
            if (textBoxs[id]?.style?.textDecoration !== 'line-through') {
                return false;
            }
        }
        return true;
    };

    const onToggleSetTextLineThrough = () => {
 
        const newStyle = {
            textDecoration: isLineThrough() ? 'none' : 'line-through'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    return (
        <div className='insert-text-side-bar'>
            <div className='splitter' />
            <div className='text-tool-menu'>
                <div className='btn-add-text' onClick={onAddText}>
                    <div className='content-left'>
                        <div className='label'>Insert text</div>
                        <div className='description'>New default text...</div>
                    </div>
                    <FontAwesomeIcon icon={faFont}/>
                </div>
                <div className='splitter' />
                <h3>Text Style</h3>
                <div className='style-menu'>
                    <Button className='style-btn' key='bold' 
                        type={isBold() ? 'primary' : undefined} 
                        onClick={onToggleSetTextBold}>
                        <FontAwesomeIcon icon={faBold}/>
                    </Button>
                    <Button className='style-btn' key='italic'
                        type={isItalic() ? 'primary' : undefined}
                        onClick={onToggleSetTextItalic}>
                        <FontAwesomeIcon icon={faItalic}/>
                    </Button>
                    <Button className='style-btn' key='underline'
                        type={isUnderline() ? 'primary' : undefined}
                        onClick={onToggleSetTextUnderline}
                    >
                        <FontAwesomeIcon icon={faUnderline}/>
                    </Button>
                    <Button className='style-btn' key='line-through'
                        type={isLineThrough() ? 'primary' : undefined}
                        onClick={onToggleSetTextLineThrough}
                    >
                        <FontAwesomeIcon icon={faStrikethrough}/>
                    </Button>
                </div>
                <h3>Font Family</h3>
                <Select 
                    className='select-font-family'
                    value={textBoxs[activeIds[0]]?.style?.fontFamily}
                    options={Object.entries(ListFontFamily).map(([key, label]) => {
                        return {
                            label: <div style={{
                                fontFamily: `${key}`, 
                                fontSize: '18px',
                                lineHeight: '40px',
                                paddingLeft: '2px'
                            }}>{label}</div>,
                            value: key
                        };
                    })}
                    onChange={onSetFontFamily}
                />
                <h3>Text Color</h3>
                <Popover 
                    trigger='click'
                    placement='rightBottom'
                    overlayClassName='pick-color-overlay'
                    content={<SketchPicker color={getRgbaFromString(textBoxs[activeIds[0]]?.style?.color) as any} 
                        onChange={color => onSetTextColor(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                    <div style={{
                        background: textBoxs[activeIds[0]]?.style.color,
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
                    content={<SketchPicker color={getRgbaFromString(textBoxs[activeIds[0]]?.style?.background as any) as any} 
                        onChange={color => onSetBackGround(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                    <div style={{
                        background: textBoxs[activeIds[0]]?.style.background,
                        border: '5px solid white',
                        width: '100px',
                        height: '30px',
                        cursor: 'pointer',
                    }}>
                    </div>
                </Popover>
                <h3>Font Size</h3>
                <div>
                    <InputNumber min={1} 
                        value={getSizeFromPixel(textBoxs[activeIds[0]]?.style?.fontSize as string)}
                        onChange={onSetFontSize}
                        className='select-font-size'
                    />
                </div>
                <h3>BorderRadius</h3>
                <div>
                    <InputNumber min={0}
                        value={getSizeFromPixel(textBoxs[activeIds[0]]?.style?.borderRadius as string)}
                        onChange={onSetBorderRadius}
                        className='select-font-size'
                    />
                </div>
            </div>
        </div>
    );
};

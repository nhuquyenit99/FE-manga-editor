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
import { TextBoxContext } from '../../context';
import './style.scss';

export const InsertTextPanel = () => {
    const { activeId, setActiveId, setTextBoxs, textBoxs, currentPage } = useContext(TextBoxContext);

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
                    page: currentPage
                }
            };
        });
        setActiveId(id);
    };

    const updateActiveTextBoxStyle = (style: React.CSSProperties) => {
        setTextBoxs(prev => {
            return {
                ...prev,
                [activeId]: {
                    ...prev[activeId],
                    style: style
                }
            };
        });
    };

    const onSetBackGround = (background?: string) => {
        const newStyle = {
            ...textBoxs[activeId].style,
            background: background
        };
        updateActiveTextBoxStyle(newStyle);
    };
    const onSetFontSize = (fontSize?: number) => {
        const newStyle = {
            ...textBoxs[activeId].style,
            fontSize: `${fontSize}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onSetBorderRadius = (borderRadius?: number) => {
        const newStyle = {
            ...textBoxs[activeId].style,
            borderRadius: `${borderRadius}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };


    const onSetTextColor = (textColor?: string) => {
        const newStyle = {
            ...textBoxs[activeId].style,
            color: textColor
        };
        updateActiveTextBoxStyle(newStyle);
    };
    
    const onSetFontFamily = (fontFamily?: string) => {
        const newStyle = {
            ...textBoxs[activeId].style,
            fontFamily: fontFamily
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextBold = () => {
        const newStyle = {
            ...textBoxs[activeId].style,
            fontWeight: textBoxs[activeId].style?.fontWeight === 'bold' ? 'normal' : 'bold'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextItalic = () => {
        const newStyle = {
            ...textBoxs[activeId].style,
            fontStyle: textBoxs[activeId].style?.fontStyle === 'italic' ? 'normal' : 'italic'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextUnderline = () => {
        const newStyle = {
            ...textBoxs[activeId].style,
            textDecoration: textBoxs[activeId].style?.textDecoration === 'underline' ?  'none' : 'underline'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextLineThrough = () => {
        const newStyle = {
            ...textBoxs[activeId].style,
            textDecoration: textBoxs[activeId].style?.textDecoration === 'line-through' ? 'none' : 'line-through'
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
                        type={textBoxs[activeId]?.style?.fontWeight === 'bold' ? 'primary' : undefined} 
                        onClick={onToggleSetTextBold}>
                        <FontAwesomeIcon icon={faBold}/>
                    </Button>
                    <Button className='style-btn' key='italic'
                        type={textBoxs[activeId]?.style?.fontStyle === 'italic' ? 'primary' : undefined}
                        onClick={onToggleSetTextItalic}>
                        <FontAwesomeIcon icon={faItalic}/>
                    </Button>
                    <Button className='style-btn' key='underline'
                        type={textBoxs[activeId]?.style?.textDecoration === 'underline' ? 'primary' : undefined}
                        onClick={onToggleSetTextUnderline}
                    >
                        <FontAwesomeIcon icon={faUnderline}/>
                    </Button>
                    <Button className='style-btn' key='line-through'
                        type={textBoxs[activeId]?.style?.textDecoration === 'line-through' ? 'primary' : undefined}
                        onClick={onToggleSetTextLineThrough}
                    >
                        <FontAwesomeIcon icon={faStrikethrough}/>
                    </Button>
                </div>
                <h3>Font Family</h3>
                <Select 
                    className='select-font-family'
                    value={textBoxs[activeId]?.style?.fontFamily}
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
                    content={<SketchPicker color={getRgbaFromString(textBoxs[activeId]?.style?.color) as any} 
                        onChange={color => onSetTextColor(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                    <div style={{
                        background: textBoxs[activeId]?.style.color,
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
                    content={<SketchPicker color={getRgbaFromString(textBoxs[activeId]?.style?.background as any) as any} 
                        onChange={color => onSetBackGround(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                    <div style={{
                        background: textBoxs[activeId]?.style.background,
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
                        value={getSizeFromPixel(textBoxs[activeId]?.style?.fontSize as string)}
                        onChange={onSetFontSize}
                        className='select-font-size'
                    />
                </div>
                <h3>BorderRadius</h3>
                <div>
                    <InputNumber min={0}
                        value={getSizeFromPixel(textBoxs[activeId]?.style?.borderRadius as string)}
                        onChange={onSetBorderRadius}
                        className='select-font-size'
                    />
                </div>
            </div>
        </div>
    );
};

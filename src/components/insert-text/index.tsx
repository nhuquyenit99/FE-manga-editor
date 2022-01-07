import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { Button, Select } from 'antd';
import { Popover, InputNumber } from 'antd';
import { SketchPicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBold, faItalic, faUnderline, faStrikethrough, faFont
} from '@fortawesome/free-solid-svg-icons';

import { defaultCordinate, defaultTextBoxStyle, ListFontFamily, TextBoxData } from '../../model';
import { getColorStrFromRgba, getRgbaFromString, getSizeFromPixel } from '../../utils';
import { ImageContext, TextBoxActiveContext } from '../../context';
import { TextBox } from '../text-box';
import './style.scss';

export const InsertTextPanel = () => {
    const { imageUrl } = useContext(ImageContext);

    const [textBoxs, setTextBoxs] = useState<Record<string, TextBoxData>>({});
    const [activeTextBox, setActiveTextBox] = useState<string>('');

    const onAddText = () => {
        const id = _.uniqueId();
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
                    style: {...defaultTextBoxStyle}
                }
            };
        });
        setActiveTextBox(id);
    };

    const removeTextBox = (id: string) => {
        let list = {...textBoxs};
        delete list[id];
        setTextBoxs(list);
        if (activeTextBox === id) {
            setActiveTextBox('');
        }
    };

    const updateActiveTextBoxStyle = (style: React.CSSProperties) => {
        setTextBoxs(prev => {
            return {
                ...prev,
                [activeTextBox]: {
                    ...prev[activeTextBox],
                    style: style
                }
            };
        });
    };

    const onSetBackGround = (background?: string) => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            background: background
        };
        updateActiveTextBoxStyle(newStyle);
    };
    const onSetFontSize = (fontSize?: number) => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            fontSize: `${fontSize}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onSetBorderRadius = (borderRadius?: number) => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            borderRadius: `${borderRadius}px`
        };
        updateActiveTextBoxStyle(newStyle);
    };


    const onSetTextColor = (textColor?: string) => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            color: textColor
        };
        updateActiveTextBoxStyle(newStyle);
    };
    
    const onSetFontFamily = (fontFamily?: string) => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            fontFamily: fontFamily
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextBold = () => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            fontWeight: textBoxs[activeTextBox].style?.fontWeight === 'bold' ? 'normal' : 'bold'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextItalic = () => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            fontStyle: textBoxs[activeTextBox].style?.fontStyle === 'italic' ? 'normal' : 'italic'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextUnderline = () => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            textDecoration: textBoxs[activeTextBox].style?.textDecoration === 'underline' ?  'none' : 'underline'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    const onToggleSetTextLineThrough = () => {
        const newStyle = {
            ...textBoxs[activeTextBox].style,
            textDecoration: textBoxs[activeTextBox].style?.textDecoration === 'line-through' ? 'none' : 'line-through'
        };
        updateActiveTextBoxStyle(newStyle);
    };

    return (
        <div className='insert-text-panel-wrapper'>
            <div className='header'>
                <div className='title'>Insert Text</div>  
            </div>
            <div className='insert-text-panel'>
                <div className='side-bar'>
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
                                type={textBoxs[activeTextBox]?.style?.fontWeight === 'bold' ? 'primary' : undefined} 
                                onClick={onToggleSetTextBold}>
                                <FontAwesomeIcon icon={faBold}/>
                            </Button>
                            <Button className='style-btn' key='italic'
                                type={textBoxs[activeTextBox]?.style?.fontStyle === 'italic' ? 'primary' : undefined}
                                onClick={onToggleSetTextItalic}>
                                <FontAwesomeIcon icon={faItalic}/>
                            </Button>
                            <Button className='style-btn' key='underline'
                                type={textBoxs[activeTextBox]?.style?.textDecoration === 'underline' ? 'primary' : undefined}
                                onClick={onToggleSetTextUnderline}
                            >
                                <FontAwesomeIcon icon={faUnderline}/>
                            </Button>
                            <Button className='style-btn' key='line-through'
                                type={textBoxs[activeTextBox]?.style?.textDecoration === 'line-through' ? 'primary' : undefined}
                                onClick={onToggleSetTextLineThrough}
                            >
                                <FontAwesomeIcon icon={faStrikethrough}/>
                            </Button>
                        </div>
                        <h3>Font Family</h3>
                        <Select 
                            className='select-font-family'
                            value={textBoxs[activeTextBox]?.style?.fontFamily}
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
                            content={<SketchPicker color={getRgbaFromString(textBoxs[activeTextBox]?.style?.color) as any} 
                                onChange={color => onSetTextColor(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                            <div style={{
                                background: textBoxs[activeTextBox]?.style.color,
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
                            content={<SketchPicker color={getRgbaFromString(textBoxs[activeTextBox]?.style?.background as any) as any} 
                                onChange={color => onSetBackGround(getColorStrFromRgba(color.rgb))} width='350px'/>}>
                            <div style={{
                                background: textBoxs[activeTextBox]?.style.background,
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
                                value={getSizeFromPixel(textBoxs[activeTextBox]?.style?.fontSize as string)}
                                onChange={onSetFontSize}
                                className='select-font-size'
                            />
                        </div>

                        <h3>BorderRadius</h3>
                        <div>
                            <InputNumber min={0}
                                value={getSizeFromPixel(textBoxs[activeTextBox]?.style?.borderRadius as string)}
                                onChange={onSetBorderRadius}
                                className='select-font-size'
                            />
                        </div>
                        <Button type='primary' shape='round' className='btn-save'>Save</Button>
                    </div>
                    
                </div>
                <div className='workspace'>
                    <div className='image-to-edit'>
                        <img src={imageUrl} alt='img-to-edit' draggable={false}/>
                        <TextBoxActiveContext.Provider
                            value={{
                                activeId: activeTextBox,
                                setActiveId: setActiveTextBox,
                                removeTextBox: removeTextBox
                            }}
                        >
                            {Object.values(textBoxs).map(textBox => (
                                <TextBox 
                                    key={textBox.id}
                                    data={textBox}
                                />
                            ))}
                        </TextBoxActiveContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useContext, useRef } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { ImageContext } from '../../context';
import { Cordinate, TextBoxData } from '../../model';
import { Popconfirm, Tooltip } from 'antd';
import { mergeClass } from '../../utils';
import './style.scss';

type TextBoxProps = {
    data: TextBoxData
    draggable?: boolean
}

export const TextBox = ({data, draggable = true}: TextBoxProps) => {
    const { setActiveIds, removeTextBox, setTextBoxs, activeIds } = useContext(ImageContext);
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

    const onClick = (e: any) => {
        e.stopPropagation();
        if (!activeIds.includes(data.id) && e.ctrlKey) {
            setActiveIds(prev =>  [...prev, data.id]);
        } else {
            setActiveIds([data.id]);
        }
        let range = document.createRange();
        range.selectNodeContents(e.target as any);
        let sel = window.getSelection()!;
        sel.removeAllRanges();
        sel.addRange(range);
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
            className={mergeClass('text-input draggable', activeIds.includes(data.id) ? 'active': '')}
        >
            <Tooltip title={data.tooltip ? `Original: ${data.tooltip}` : ''}
                overlayInnerStyle={{
                    fontSize: '16px'
                }}
            > 
                <div 
                    style={data.style}
                    className='text-editable' 
                    contentEditable
                    onClick={onClick}
                    // onBlur={() => {
                    //     let sel = window.getSelection()!;
                    //     sel.removeAllRanges();
                    // }}
                    onInput={onChangeText} 
                    data-placeholder="Text Box"
                    dangerouslySetInnerHTML={{__html: defaultValue.current}}
                >
                </div>
            </Tooltip>

            <Popconfirm title="Delete this textbox?" onConfirm={() => removeTextBox(data.id)}
                okText='Yes'
                cancelText='No'
                placement='rightTop'
            >
                <CloseCircleOutlined className='btn-delete'/>
            </Popconfirm>
        </Rnd>
    );
};
import React, { useCallback, useContext, useRef, useState } from 'react';
import moment from 'moment';
import CanvasDraw from 'react-canvas-draw';
import { Button } from 'antd';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { 
    CropperImagePanel, InsertTextPanel, 
    UploadImageDragger, TextBox, 
    ExportImageModal, EraseMenu 
} from '../../../components';
import { EraserContext, ImageContext, TextBoxContext } from '../../../context';
import { useImageSize } from '../../../utils';
import { TextBoxData } from '../../../model';
import { EditSideBar } from './side-bar';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { imageUrl, setImageUrl } = useContext(ImageContext);

    let { panel } = useParams<{panel: EditAction}>();
    const history = useHistory();

    const imageRef = useRef<any>();
    const saveModelRef = useRef<any>();
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();

    const [textBoxs, setTextBoxs] = useState<Record<string, TextBoxData>>({});
    const [activeTextBox, setActiveTextBox] = useState<string>('');
    const [brushWidth, setBrushWidth] = useState(10);
    const [brushColor, setBrushColor] = useState('rgba(255,255,255,1)');

    let canvasDrawRef = null as any;

    const removeTextBox = (id: string) => {
        let list = {...textBoxs};
        delete list[id];
        setTextBoxs(list);
        if (activeTextBox === id) {
            setActiveTextBox('');
        }
    };

    const onExport = useCallback(async (fileName: string, extension: '.jpg' | '.png' | '.svg') => {
        zoomRef.current?.resetTransform();
        let dataUrl;
        switch(extension) {
        case '.jpg': 
            dataUrl = await toJpeg(imageRef.current, { cacheBust: true, });
            break;
        case '.png': 
            dataUrl = await toPng(imageRef.current, { cacheBust: true, });
            break;
        case '.svg': 
            dataUrl = await toSvg(imageRef.current, { cacheBust: true, });
            break;
        }
        const link = document.createElement('a');
        link.download = `${fileName}${extension}`;
        link.href = dataUrl;
        link.click();
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
        localStorage.setItem('uploadedList', JSON.stringify([{
            url: dataUrl,
            original_filename: fileName,
            created_at: moment().toISOString()
        }, ...uploadedList]));
    },[imageRef, zoomRef]);

    const { canvasHeight, canvasWidth } = useImageSize(imageUrl);

    if (!panel) {
        return <Redirect to='/edit/text'/>;
    }

    if (!imageUrl) {
        return (
            <div className='edit-page-layout'>
                <EditSideBar 
                    action={panel}
                />
                <div className='main-content'>
                    <div className='header'>
                        <div className='title'>Edit Page</div>  
                        <div className='suffix'>
                            <Button shape='round' onClick={() => {
                                setImageUrl('');
                                history.push('/');
                            }} >Cancel</Button>
                        </div>
                    </div>
                    <div className='upload-image-panel'>
                        <UploadImageDragger />
                    </div>
                </div>
            </div>
        );
    }
    const Panel = EditPanel[panel];

    return (
        <div className='edit-page-layout'>
            <EditSideBar 
                action={panel}
            />
            <div className='main-content'>
                <div className='header'>
                    <div className='title'>Edit Page</div>  
                    <div className='suffix'>
                        <Button shape='round' onClick={() => {
                            setImageUrl('');
                            history.push('/');
                        }} >Cancel</Button>
                        {imageUrl && <Button type='primary' onClick={() => saveModelRef.current?.open()} shape='round'>
                            Export
                        </Button>}
                    </div>
                </div>
                <div className='edit-panel-content'>
                    <TextBoxContext.Provider
                        value={{
                            activeId: activeTextBox,
                            setActiveId: setActiveTextBox,
                            removeTextBox: removeTextBox,
                            textBoxs: textBoxs,
                            setTextBoxs: setTextBoxs
                        }}
                    >
                        <EraserContext.Provider value={{
                            color: brushColor,
                            setColor: setBrushColor,
                            brushWidth: brushWidth,
                            setBrushWidth: setBrushWidth,
                            onUndo: () => canvasDrawRef?.undo?.(),
                            onClearAll: () => canvasDrawRef?.eraseAll?.()
                        }}
                        >
                            <Panel />
                            <div className='workspace'>
                                <TransformWrapper
                                    minScale={0.2}
                                    maxScale={3}
                                    // disabled
                                    ref={zoomRef}
                                >
                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                        <div className='image-wrapper'>
                                            <TransformComponent>
                                                <div className='image-to-edit' ref={imageRef}>
                                                    <CanvasDraw imgSrc={imageUrl ?? ''}
                                                        canvasHeight={canvasHeight}
                                                        canvasWidth={canvasWidth}
                                                        hideGrid
                                                        ref={canvasDraw => (canvasDrawRef = canvasDraw)}
                                                        onChange={() => {}}
                                                        disabled={panel !== 'erase'}
                                                        brushColor={brushColor}
                                                        brushRadius={brushWidth}
                                                    />
                                                    {Object.values(textBoxs).map(textBox => (
                                                        <TextBox 
                                                            key={textBox.id}
                                                            data={textBox}
                                                        />
                                                    ))}
                                                </div>
                                            </TransformComponent>
                                            <div className="tools">
                                                <button onClick={() => zoomIn()}>+</button>
                                                <button onClick={() => zoomOut()}>-</button>
                                                <button onClick={() => resetTransform()}>x</button>
                                            </div>
                                        </div>
                                    )}
                                </TransformWrapper>
                                <ExportImageModal 
                                    onSave={onExport}
                                    ref={saveModelRef}
                                />
                            </div>
                        </EraserContext.Provider>
                    </TextBoxContext.Provider>
                </div>
            </div>
        </div>
    );
};

const EditPanel: Record<EditAction, React.ComponentType> = {
    crop: CropperImagePanel,
    text: InsertTextPanel,
    draw: () => <div style={{color: 'white'}}>Draw Panel</div>,
    erase: EraseMenu
};
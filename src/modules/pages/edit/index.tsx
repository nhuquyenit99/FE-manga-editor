import React, { useCallback, useContext, useRef, useState } from 'react';
import moment from 'moment';
import uniqid from 'uniqid';
import CanvasDraw from 'react-canvas-draw';
import { Button, Dropdown, Menu, notification, Tooltip } from 'antd';
import { DownOutlined, ExportOutlined, TranslationOutlined, SaveOutlined } from '@ant-design/icons';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { 
    CropperImagePanel, InsertTextPanel, 
    UploadImageDragger, TextBox, 
    ExportImageModal, EraseMenu, PDFViewer 
} from '../../../components';
import { EraserContext, ImageContext } from '../../../context';
import { mergeClass, useImageSize } from '../../../utils';
import { EditSideBar } from './side-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandRock, faMousePointer, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { 
        currentImage, setCurrentImage, 
        textBoxs, currentPage,
        drawSaveData, setDrawSaveData,
    } = useContext(ImageContext);

    let { panel } = useParams<{panel: EditAction}>();
    const history = useHistory();

    const imageRef = useRef<any>();
    const saveModelRef = useRef<any>();
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();
    const [brushWidth, setBrushWidth] = useState(10);
    const [brushColor, setBrushColor] = useState('rgba(255,255,255,1)');
    const [panable, setPanable] = useState(false);

    // let canvasDrawRef = null as any;
    const canvasDrawRef = useRef<CanvasDraw | null>(null);
    let PDFViewerRef = React.createRef<any>();

    const onExport = useCallback(async (fileName: string, extension: '.jpg' | '.png' | '.svg') => {
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
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}');
        const id = uniqid();
        localStorage.setItem('uploadedList', JSON.stringify({
            [id]: {
                id: id,
                url: dataUrl,
                original_filename: fileName,
                created_at: moment().toISOString(),
                type: 'image',
                textBoxs: {},
                drawSaveData: undefined
            }, 
            ...uploadedList
        }));
    },[imageRef]);

    const onSaveData = () => {
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}');
        const drawSaveData = canvasDrawRef.current?.getSaveData();
        if (currentImage) {
            setDrawSaveData(prev => {
                return {
                    ...prev, 
                    [currentPage]: drawSaveData ?? ''
                };
            });
            const newUploadedList = {
                ...uploadedList,
                [currentImage.id]: {
                    ...uploadedList[currentImage.id],
                    drawSaveData: drawSaveData,
                    textBoxs: textBoxs
                }
            };
            localStorage.setItem('uploadedList', JSON.stringify(newUploadedList));
            notification.success({
                message: 'Saved'
            });
        }
    };

    const { canvasHeight, canvasWidth } = useImageSize(currentImage?.url ?? '');

    if (!panel) {
        return <Redirect to='/edit/text'/>;
    }

    if (!currentImage) {
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
                                setCurrentImage(undefined);
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
                        {currentImage && 
                        <Dropdown trigger={['click']} overlayClassName='custom-dropdown' overlay={<Menu>
                            <Menu.Item onClick={() => {
                                zoomRef.current?.resetTransform();
                                saveModelRef.current?.open();
                            }} icon={<ExportOutlined size={16}/>}>
                                Export
                            </Menu.Item>
                            <Menu.Item onClick={onSaveData} icon={<SaveOutlined size={16}/>}>
                                Save
                            </Menu.Item>
                            <Menu.Item onClick={() => {
                                zoomRef.current?.resetTransform();
                                // history.push('/translate');
                            }} icon={<TranslationOutlined size={16}/>}>
                                Auto-Translate
                            </Menu.Item>
                        </Menu>}>
                            <Button type='primary' shape='round' className='menu-action'>Menu <DownOutlined/></Button>
                        </Dropdown>}
                        <Button shape='round' onClick={() => {
                            setCurrentImage(undefined);
                            history.push('/');
                        }} >Cancel</Button>
                    </div>
                </div>
                <div className='edit-panel-content'>
                    <EraserContext.Provider value={{
                        color: brushColor,
                        setColor: setBrushColor,
                        brushWidth: brushWidth,
                        setBrushWidth: setBrushWidth,
                        onUndo: () => {
                            if (currentImage.type === 'application/pdf') {
                                PDFViewerRef.current?.undo();
                            } else {
                                canvasDrawRef.current?.undo?.();
                            }
                        } ,
                        onClearAll: () => {
                            if (currentImage.type === 'application/pdf') {
                                PDFViewerRef.current?.clear();
                            } else {
                                canvasDrawRef.current?.clear?.();
                            }
                        }
                    }}
                    >
                        <Panel />
                        <div className='workspace'>
                            <div className='change-mode-tool'>
                                <Tooltip title='Disable Dragging' placement='right'>
                                    <button onClick={() => setPanable(false)}
                                        className={!panable ? 'active' : ''}
                                    ><FontAwesomeIcon icon={faMousePointer}/></button>
                                </Tooltip>
                                <Tooltip title='Drag Image' placement='right'>
                                    <button onClick={() => setPanable(true)}
                                        className={panable ? 'active': ''}
                                    ><FontAwesomeIcon icon={faHandRock}/></button>
                                </Tooltip>
                            </div>
                            {currentImage.type === 'application/pdf' 
                                ? <PDFViewer url={currentImage.url}
                                    ref={PDFViewerRef}
                                    imageRef={imageRef}
                                    panel={panel}
                                    textBoxDraggable={!panable}
                                />
                                : <TransformWrapper
                                    minScale={0.2}
                                    maxScale={2}
                                    centerZoomedOut
                                    panning={{
                                        disabled: !panable
                                    }}
                                    ref={zoomRef}
                                >
                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                        <div className='image-panel-wrapper'>
                                            <div className='image-wrapper'>
                                                <TransformComponent 
                                                    contentClass={mergeClass(panel === 'erase' ? 'erase-mode' : undefined, 
                                                        panable ? 'panable': ''
                                                    )}
                                                >
                                                    <><div className='image-to-edit' ref={imageRef}>
                                                        <CanvasDraw imgSrc={currentImage.url ?? ''}
                                                            canvasHeight={canvasHeight}
                                                            canvasWidth={canvasWidth}
                                                            hideGrid
                                                            ref={canvasDraw => (canvasDrawRef.current = canvasDraw)}
                                                            onChange={() => {}}
                                                            disabled={panel !== 'erase'}
                                                            brushColor={brushColor}
                                                            lazyRadius={1}
                                                            brushRadius={brushWidth}
                                                            saveData={drawSaveData?.[currentPage]}
                                                        />
                                                        {Object.values(textBoxs).map(textBox => (
                                                            <TextBox 
                                                                key={textBox.id}
                                                                data={textBox}
                                                                draggable={!panable}
                                                            />
                                                        ))}
                                                    </div>
                                                    </>
                                                </TransformComponent>
                                            </div>
                                            {<div className="tools">
                                                <button onClick={() => zoomIn(0.15)} title='Zoom In'><FontAwesomeIcon icon={faSearchPlus}/></button>
                                                <button onClick={() => zoomOut(0.15)} title='Zoom Out'><FontAwesomeIcon icon={faSearchMinus}/></button>
                                                <button onClick={() => resetTransform()} title='Reset'><FontAwesomeIcon icon={faTimes}/></button>
                                            </div>}
                                        </div>
                                    )}
                                </TransformWrapper>
                            }
                            <ExportImageModal 
                                onSave={onExport}
                                ref={saveModelRef}
                            />
                        </div>
                    </EraserContext.Provider>
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


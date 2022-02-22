import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Button, Dropdown, Menu, notification, Tooltip } from 'antd';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { DownOutlined, ExportOutlined, TranslationOutlined, SaveOutlined } from '@ant-design/icons';
import { exportComponentAsPDF, exportComponentAsJPEG, exportComponentAsPNG } from 'react-component-export-image';
import { faHandRock, faMousePointer, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { 
    TranslateModelRef, PDFViewerRef,
    CropperImagePanel, InsertTextPanel, 
    ExportImageModal, EraseMenu, PDFViewer, 
    UploadImageDragger, TextBox, TranslateModal, 
} from '../../../components';
import { EditSideBar } from './side-bar';
import { mergeClass, useImageSize } from '../../../utils';
import { EraserContext, ImageContext } from '../../../context';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { 
        currentImage, setCurrentImage, 
        textBoxs, currentPage,
        drawSaveData, setDrawSaveData,
        setActiveIds
    } = useContext(ImageContext);

    let { panel } = useParams<{panel: EditAction}>();
    const history = useHistory();

    const imageRef = useRef<any>();
    const exportModelRef = useRef<any>();
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();
    const canvasDrawRef = useRef<CanvasDraw | null>(null);
    const PDFViewerRef = useRef<PDFViewerRef>();
    const translateModalRef = useRef<TranslateModelRef>();

    const [brushWidth, setBrushWidth] = useState(10);
    const [brushColor, setBrushColor] = useState('rgba(255,255,255,1)');
    const [panable, setPanable] = useState(false);
    const [hideDrawInterface, setHideDrawInterface] = useState(panel !== 'erase');

    useEffect(() => {
        if (panel === 'erase') {
            setHideDrawInterface(false);
        } else {
            setHideDrawInterface(true);
        }
    },[panel]);

    const onExport = useCallback(async (fileName: string, extension: '.jpg' | '.png' | '.pdf') => {
        setHideDrawInterface(true);
        switch(extension) {
        case '.jpg': 
            exportComponentAsJPEG(imageRef, {
                fileName: fileName
            });
            break;
        case '.png': 
            exportComponentAsPNG(imageRef, {
                fileName: fileName
            });
            break;
        case '.pdf': 
            exportComponentAsPDF(imageRef, {
                fileName: fileName,
                pdfOptions: {
                    w: 210,
                    h: 297,
                }
            });
            break;
        }
        setHideDrawInterface(panel !== 'erase');
        onSaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[imageRef]);

    const onSaveData = () => {
        if (currentImage?.type === 'application/pdf') {
            PDFViewerRef.current?.save();
            return;
        }
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}');
        const newdrawSaveData = canvasDrawRef.current?.getSaveData();
        if (currentImage) {
            const newUploadedList = {
                ...uploadedList,
                [currentImage.id]: {
                    ...uploadedList[currentImage.id],
                    drawSaveData: {
                        ...drawSaveData,
                        [currentPage]: newdrawSaveData
                    },
                    textBoxs: textBoxs
                }
            };
            localStorage.setItem('uploadedList', JSON.stringify(newUploadedList));
            setDrawSaveData(prev => {
                return {
                    ...prev, 
                    [currentPage]: newdrawSaveData ?? ''
                };
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
                                onSaveData();
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
                            <Menu.Item key='export' onClick={() => {
                                zoomRef.current?.resetTransform();
                                setActiveIds([]);
                                exportModelRef.current?.open();
                            }} icon={<ExportOutlined size={16}/>}>
                                Export
                            </Menu.Item>
                            <Menu.Item key='save' onClick={() => {
                                onSaveData();
                                notification.success({
                                    message: 'Saved'
                                });
                            }} icon={<SaveOutlined size={16}/>}>
                                Save
                            </Menu.Item>
                            <Menu.Item key='trans' onClick={() => {
                                zoomRef.current?.resetTransform();
                                translateModalRef.current?.open({
                                    file_name: currentImage.type === 'application/pdf' 
                                        ? `${currentImage.original_filename}_page${currentPage}` : currentImage.original_filename,
                                    page: currentPage,
                                    url: currentImage.type === 'application/pdf' 
                                        ? (PDFViewerRef.current?.getDataUrlFromPage(currentPage) ?? '') : currentImage.url
                                });
                                // translate(currentImage.type === 'application/pdf' ? PDFViewerRef.current?.getDataUrlFromPage(currentPage) : undefined);
                            }} icon={<TranslationOutlined size={16}/>}>
                                Auto-Translate
                            </Menu.Item>
                        </Menu>}>
                            <Button type='primary' shape='round' className='menu-action'>Menu <DownOutlined/></Button>
                        </Dropdown>}
                        <Button shape='round' onClick={() => {
                            onSaveData();
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
                                                    <><div className='image-to-edit' ref={imageRef} onClick={() => {
                                                        setActiveIds([]);
                                                    }}>
                                                        <CanvasDraw imgSrc={currentImage.url ?? ''}
                                                            canvasHeight={canvasHeight}
                                                            canvasWidth={canvasWidth}
                                                            hideGrid
                                                            ref={canvasDraw => (canvasDrawRef.current = canvasDraw)}
                                                            onChange={() => {}}
                                                            disabled={panel !== 'erase'}
                                                            brushColor={brushColor}
                                                            lazyRadius={1}
                                                            hideInterface={hideDrawInterface}
                                                            brushRadius={brushWidth}
                                                            saveData={drawSaveData?.[currentPage] ?? undefined}
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
                                onSave={async (fileName, extension) => {
                                    if (currentImage.type === 'application/pdf') {
                                        await PDFViewerRef.current?.export?.(fileName, extension);
                                    } else {
                                        await onExport(fileName, extension);
                                    }
                                }}
                                ref={exportModelRef}
                            />
                        </div>
                    </EraserContext.Provider>
                    <TranslateModal ref={translateModalRef} />
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


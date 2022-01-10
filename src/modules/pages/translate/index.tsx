import React, { useCallback, useContext, useRef, useState } from 'react';
import moment from 'moment';
import CanvasDraw from 'react-canvas-draw';
import { Button, Tooltip } from 'antd';
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
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer, faSearch, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateSideBar } from './side-bar';


export const TranslatePage = () => {
    const { imageUrl, setImageUrl } = useContext(ImageContext);
    const history = useHistory();

    const imageRef = useRef<any>();
    const saveModelRef = useRef<any>();
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();

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
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
        localStorage.setItem('uploadedList', JSON.stringify([{
            url: dataUrl,
            original_filename: fileName,
            created_at: moment().toISOString()
        }, ...uploadedList]));
    },[imageRef]);

    if (!imageUrl) {
        return (
            <div className='edit-page-layout'>
                <TranslateSideBar />
                <div className='main-content'>
                    <div className='header'>
                        <div className='title'>Translate Page</div>  
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

    
    return (
        <div className='edit-page-layout'>
            <TranslateSideBar />
            <div className='main-content'>
                <div className='header'>
                    <div className='title'>Translate Page</div>  
                    <div className='suffix'>
                        <Button shape='round' onClick={() => {
                            setImageUrl('');
                            history.push('/');
                        }} >Cancel</Button>
                        {imageUrl && <Button type='primary' onClick={() => {
                            zoomRef.current?.resetTransform();
                            saveModelRef.current?.open();
                        }} shape='round'>
                            Export
                        </Button>}
                    </div>
                </div>
                <div className='edit-panel-content'>
                    <div className='workspace'>
                        {/* <div className='change-mode-tool'>
                            {panel === 'erase' && <>
                                <Tooltip title='Disable Zoom' placement='right'>
                                    <button onClick={() => {
                                        setDisableZoom(true);
                                        zoomRef.current?.resetTransform();
                                    }}
                                    className={disableZoom ? 'active' : ''}
                                    ><FontAwesomeIcon icon={faMousePointer}/></button>
                                </Tooltip>
                                <Tooltip title='Zoom' placement='right'>
                                    <button onClick={() => setDisableZoom(false)}
                                        className={disableZoom ? '' : 'active'}
                                    ><FontAwesomeIcon icon={faSearch}/></button>
                                </Tooltip>
                            </>}
                        </div> */}
                        <TransformWrapper
                            minScale={0.2}
                            maxScale={3}
                            ref={zoomRef}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <div className='image-panel-wrapper'>
                                    <div className='image-wrapper'>
                                        <TransformComponent>
                                            <img src={imageUrl} alt='manga-img' className='image-to-edit'/>       
                                        </TransformComponent>
                                    </div>
                                    <div className="tools">
                                        <Tooltip title='Zoom In' placement='left'>
                                            <button onClick={() => zoomIn()} ><FontAwesomeIcon icon={faSearchPlus}/></button>
                                        </Tooltip>
                                        <Tooltip title='Zoom Out' placement='left'>
                                            <button onClick={() => zoomOut()} ><FontAwesomeIcon icon={faSearchMinus}/></button>
                                        </Tooltip>
                                        <Tooltip title='Reset' placement='left'>
                                            <button onClick={() => resetTransform()}><FontAwesomeIcon icon={faTimes}/></button>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                        </TransformWrapper>
                        {/* <div className='image-to-edit' ref={imageRef}>
                            <CanvasDraw imgSrc={imageUrl ?? ''}
                                canvasHeight={canvasHeight}
                                canvasWidth={canvasWidth}
                                hideGrid
                                ref={canvasDraw => (canvasDrawRef = canvasDraw)}
                                onChange={() => {}}
                                disabled={panel !== 'erase'}
                                brushColor={brushColor}
                                lazyRadius={1}
                                brushRadius={brushWidth}
                                //@ts-ignore
                                enablePanAndZoom={!disableZoom}
                            />
                            {Object.values(textBoxs).map(textBox => (
                                <TextBox 
                                    key={textBox.id}
                                    data={textBox}
                                />
                            ))}
                        </div>
                        {panel === 'erase' && !disableZoom && <div className='tools'>
                            <button onClick={() => {
                                canvasDrawRef?.resetView?.();
                            }}>Reset View
                            </button>
                        </div>} */}
                        <ExportImageModal 
                            onSave={onExport}
                            ref={saveModelRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
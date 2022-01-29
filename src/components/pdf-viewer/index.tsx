import React, { useRef, useState, useEffect, useContext, forwardRef, useImperativeHandle, useCallback } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { notification } from 'antd';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { EraserContext, ImageContext } from '../../context';
import { LoadingFullView } from '../loading';
import { mergeClass, useImageSize } from '../../utils';
import { TextBox } from '../text-box';
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
// import html2canvas from 'html2canvas';
import './style.scss';

type PDFViewerProps = {
    url: string,
    imageRef: any
    panel: 'crop' | 'text' | 'draw' | 'erase';
    textBoxDraggable?: boolean
}

export type PDFViewerRef = {
    undo: () => void,
    clear: () => void,
    save: () => void,
    export: (fileName: string, extension: '.jpg' | '.png' | '.pdf') => Promise<void>
}

export const PDFViewer = forwardRef(({ 
    url, imageRef, panel = 'text', textBoxDraggable = true 
}: PDFViewerProps, ref) =>  {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const { 
        currentImage, textBoxs, 
        setCurrentPage, drawSaveData, 
        currentPage, setDrawSaveData,
    } = useContext(ImageContext);
    const { brushWidth, color: brushColor  } = useContext(EraserContext);

    const [numPages, setNumPages] = useState<number>();
    const [rehydrate, setRehydrate] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [loadingAll, setLoadingAll] = useState(false);
    const [currentUrl, setCurrentUrl] = useState<string>();

    const pdfDataRef = useRef<PDFDocumentProxy>();
    const currentCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const listCanvasUrlRef = useRef<any>([]);
    const canvasDrawRef = useRef<CanvasDraw | null>(null);
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();
    const [hideDrawInterface, setHideDrawInterface] = useState(panel !== 'erase');

    
    const { canvasHeight, canvasWidth } = useImageSize(listCanvasUrlRef.current?.[0] ?? '');

    useImperativeHandle(ref, () => ({
        undo: canvasDrawRef.current?.undo,
        clear: canvasDrawRef.current?.clear,
        save: onSaveData,
        export: onExport
    }));

    const changePage = (offset: number) => {
        setPageLoaded(false);
        const saveData = canvasDrawRef.current?.getSaveData();
        setDrawSaveData(prev => {
            return {
                ...prev,
                [currentPage]: saveData ?? ''
            };
        });
        setCurrentPage(prev => prev + offset);
        zoomRef.current?.resetTransform();
        
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () =>{
        changePage(1);
    };

    const onSaveData = () => {
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

    useEffect(() => {
        if (panel === 'erase') {
            setHideDrawInterface(false);
        } else {
            setHideDrawInterface(true);
        }
    },[panel]);

    useEffect(() => {
        if (numPages) {
            listCanvasUrlRef.current = Array.from({length: numPages}, (_, i) => i + 1)
                .map((idx) => listCanvasUrlRef.current[idx] = React.createRef<HTMLCanvasElement | null>());
            // get all pages and convert them into image urls
            (async() => {
                try {
                    setLoadingAll(true);
                    await Promise.all(Array.from({length: numPages}, (_, i) => i + 1).map(async(page) => {
                        return pdfDataRef.current?.getPage(page).then(async (res) => {
                            const viewport = res.getViewport({
                                scale: 1.5
                            });
                            let canvas = document.createElement('canvas');
                            canvas.style.display = 'block';
                            const context = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
    
                            //draw on the canvas
                            res.render({
                                canvasContext: context ?? {}, 
                                viewport: viewport
                            }).promise.then(() => {
                                const url = canvas.toDataURL();
                                listCanvasUrlRef.current[page] = url;
                            });
                        });
                    }));
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoadingAll(false);
                }
               
            })();
        }
    }, [numPages]);

    useEffect(() => {
        if (rehydrate && pageLoaded) {
            setCurrentUrl(currentCanvasRef.current?.toDataURL());
        }
    },[currentPage, currentCanvasRef, rehydrate, pageLoaded]);


    return (
        <div className="pdf-viewer">
            <div className='header-tool'>
                <div className="buttonc">
                    <button
                        disabled={currentPage <= 1}
                        onClick={previousPage}
                        className="Pre"
                    >
                        <FontAwesomeIcon icon={faCaretLeft}/>
                    </button>
                    <span>{`${currentPage || (numPages ? 1 : '-')}/${numPages || '-'}`}</span>
                    <button
                        disabled={currentPage >= (numPages ?? 0)}
                        onClick={nextPage}
                    >
                        <FontAwesomeIcon icon={faCaretRight}/>
                    </button>
                </div>
            </div>
            <div className='pdf-viewer-wrapper'>
                <Document
                    file={currentImage?.url}
                    className='document-pdf-viewer'
                    onLoadSuccess={(pdf) => {
                        pdfDataRef.current = pdf;
                        setNumPages(pdf.numPages);
                        // setPageNumber(1);
                    }}
                    onLoadError={e => {
                        notification.error({
                            message: 'Loading Pdf failed'
                        });
                    }}
                >
                    <Page pageNumber={currentPage} scale={1.5}
                        onRenderSuccess={() => {
                            setPageLoaded(true);
                        }}
                        onRenderError={e => {
                            setPageLoaded(true);
                            setRehydrate(true);
                        }} 
                        canvasRef={canvas => {
                            currentCanvasRef.current = canvas;
                            setRehydrate(true);
                        }}
                    />
                </Document>
                <TransformWrapper
                    minScale={0.2}
                    maxScale={2}
                    centerZoomedOut
                    panning={{
                        disabled: textBoxDraggable
                    }}
                    ref={zoomRef}
                >
                    {({ zoomIn, zoomOut, resetTransform,...rest }) => (
                        <div className='image-panel-wrapper'>
                            <div className='image-wrapper'>
                                <TransformComponent 
                                    contentClass={mergeClass(panel === 'erase' ? 'erase-mode' : undefined, 
                                        !textBoxDraggable ? 'panable': ''
                                    )}
                                    key={currentUrl}
                                >
                                    <div className='image-to-edit' ref={imageRef}>
                                        {(!pageLoaded || loadingAll) && <LoadingFullView />}
                                        <CanvasDraw imgSrc={currentUrl}
                                            key={`${currentUrl}-${currentPage}`}
                                            canvasHeight={canvasHeight}
                                            canvasWidth={canvasWidth}
                                            hideGrid
                                            ref={canvasDraw => (canvasDrawRef.current = canvasDraw)}
                                            onChange={() => {}}
                                            disabled={panel !== 'erase'}
                                            brushColor={brushColor}
                                            lazyRadius={1}
                                            brushRadius={brushWidth}
                                            hideInterface={hideDrawInterface}
                                            saveData={drawSaveData?.[currentPage] ?? undefined}
                                        />
                                        {Object.values(textBoxs).filter(item => item.page === currentPage)
                                            .map(textBox => (
                                                <TextBox 
                                                    key={textBox.id}
                                                    data={textBox}
                                                    draggable={textBoxDraggable}
                                                />
                                            ))
                                        }
                                    </div>
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
            </div>
        </div>
    );
});
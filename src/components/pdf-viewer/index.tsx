import React, { useRef, useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { notification } from 'antd';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { EraserContext, ImageContext, TextBoxContext } from '../../context';
import { LoadingFullView } from '../loading';
import { mergeClass, useImageSize } from '../../utils';
import { TextBox } from '../text-box';
import './style.scss';

type PDFViewerProps = {
    url: string,
    imageRef: any
    panel: 'crop' | 'text' | 'draw' | 'erase';
    textBoxDraggable?: boolean
}

export const PDFViewer = forwardRef(({ 
    url, imageRef, panel = 'text', textBoxDraggable = true 
}: PDFViewerProps, ref) =>  {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const { currentImage } = useContext(ImageContext);
    const { brushWidth, color: brushColor  } = useContext(EraserContext);
    const { textBoxs, setCurrentPage } = useContext(TextBoxContext);

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState(1);
    const [rehydrate, setRehydrate] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [currentUrl, setCurrentUrl] = useState<string>();

    const pdfDataRef = useRef<PDFDocumentProxy>();
    const currentCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const listCanvasUrlRef = useRef<any>([]);
    const canvasDrawRef = useRef<CanvasDraw | null>(null);
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();
    
    const { canvasHeight, canvasWidth } = useImageSize(listCanvasUrlRef.current?.[0] ?? '');

    useImperativeHandle(ref, () => ({
        undo: canvasDrawRef.current?.undo,
        clear: canvasDrawRef.current?.clear,
    }));

    const changePage = (offset: number) => {
        setPageLoaded(false);
        setCurrentPage(pageNumber + offset);
        setPageNumber(prevPageNumber => prevPageNumber + offset);
        zoomRef.current?.resetTransform();
        const saveData = canvasDrawRef.current?.getSaveData();
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () =>{
        changePage(1);
    };

    const exportPDf = () => {

    };

    // const getPDFPageToExport = (page: number) => {
    //     return (
    //         <div className='image-to-edit' ref={imageRef}>
    //             <CanvasDraw imgSrc={currentUrl}
    //                 key={`${currentUrl}-${pageNumber}`}
    //                 canvasHeight={canvasHeight}
    //                 canvasWidth={canvasWidth}
    //                 hideGrid
    //                 ref={canvasDraw => (canvasDrawRef.current = canvasDraw)}
    //                 onChange={() => {}}
    //                 disabled={panel !== 'erase'}
    //                 brushColor={brushColor}
    //                 lazyRadius={1}
    //                 brushRadius={brushWidth}
    //                 hideInterface={panel !== 'erase'}
    //             />
    //             {Object.values(textBoxs).filter(item => item.page === pageNumber)
    //                 .map(textBox => (
    //                     <TextBox 
    //                         key={textBox.id}
    //                         data={textBox}
    //                         draggable={textBoxDraggable}
    //                     />
    //                 ))
    //             }
    //         </div>
    //     );
    // };

    useEffect(() => {
        if (numPages) {
            listCanvasUrlRef.current = Array.from({length: numPages}, (_, i) => i + 1)
                .map((idx) => listCanvasUrlRef.current[idx] = React.createRef<HTMLCanvasElement | null>());

            // get all pages and convert them into image urls
            (async() => {
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
            })();
        }
    }, [numPages]);

    useEffect(() => {
        if (rehydrate && pageLoaded) {
            setCurrentUrl(currentCanvasRef.current?.toDataURL());
        }
    },[pageNumber, currentCanvasRef, rehydrate, pageLoaded]);


    return (
        <div className="pdf-viewer">
            <div className='header-tool'>
                <div className="buttonc">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                        className="Pre"
                    >
                        <FontAwesomeIcon icon={faCaretLeft}/>
                    </button>
                    <span>{`${pageNumber || (numPages ? 1 : '-')}/${numPages || '-'}`}</span>
                    <button
                        disabled={pageNumber >= (numPages ?? 0)}
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
                    <Page pageNumber={pageNumber} scale={1.5}
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
                                        {!pageLoaded && <LoadingFullView />}
                                        <CanvasDraw imgSrc={currentUrl}
                                            key={`${currentUrl}-${pageNumber}`}
                                            canvasHeight={canvasHeight}
                                            canvasWidth={canvasWidth}
                                            hideGrid
                                            ref={canvasDraw => (canvasDrawRef.current = canvasDraw)}
                                            onChange={() => {}}
                                            disabled={panel !== 'erase'}
                                            brushColor={brushColor}
                                            lazyRadius={1}
                                            brushRadius={brushWidth}
                                            hideInterface={panel !== 'erase'}
                                        />
                                        {Object.values(textBoxs).filter(item => item.page === pageNumber)
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
import React, { useRef, useState, useEffect, useContext } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { notification } from 'antd';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { EraserContext, ImageContext, TextBoxContext } from '../../context';
import { LoadingFullView } from '../loading';
import { useImageSize } from '../../utils';
import { TextBox } from '../text-box';
import './style.scss';

type PDFViewerProps = {
    url: string,
    canvasDrawRef: any
    imageRef: any
    panel: 'crop' | 'text' | 'draw' | 'erase';
    disableZoom?: boolean
}

export function PDFViewer({ url, canvasDrawRef, imageRef, panel = 'text', disableZoom = true }: PDFViewerProps) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const { currentImage } = useContext(ImageContext);
    const { brushWidth, color: brushColor  } = useContext(EraserContext);
    const { textBoxs, setCurrentPage } = useContext(TextBoxContext);

    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState(1);
    const [rehydrate, setRehydrate] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    const pdfDataRef = useRef<PDFDocumentProxy>();
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const [canvasUrl, setCanvasUrl] = useState<string>();

    /*To Prevent right click on screen*/
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    const changePage = (offset: number) => {
        setPageLoaded(false);
        setCurrentPage(pageNumber + offset);
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () =>{
        changePage(1);
    };

    useEffect(() => {
        if (rehydrate && pageLoaded) {
            setCanvasUrl(canvasRef.current?.toDataURL());
        }
    },[pageNumber, canvasRef, rehydrate, pageLoaded]);

    const { canvasHeight, canvasWidth } = useImageSize(canvasUrl ?? '');

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
                {(!pageLoaded || !rehydrate) && <LoadingFullView />}
                <Document
                    file={currentImage?.url}
                    className='document-pdf-viewer'
                    // loading={() => <LoadingFullView/>}
                    // renderMode='svg'
                    onLoadSuccess={(pdf) => {
                        pdfDataRef.current = pdf;
                        setNumPages(pdf.numPages);
                        setPageNumber(1);
                    }}
                    onLoadError={e => {
                        notification.error({
                            message: 'Loading Pdf failed'
                        });
                    }}
                >
                    <Page pageNumber={pageNumber} scale={1} 
                        onRenderSuccess={() => {
                            setPageLoaded(true);
                        }}
                        onRenderError={e => {
                            setPageLoaded(true);
                            setRehydrate(true);
                        }} 
                        canvasRef={canvas => {
                            canvasRef.current = canvas;
                            setRehydrate(true);
                        }}/>
                
                    {/* {canvasUrl && <img src={canvasUrl} alt='img-editable'/>} */}
                </Document>
                <><div className='image-to-edit' ref={imageRef}>
                    <CanvasDraw imgSrc={canvasUrl}
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
                    {Object.values(textBoxs).filter(item => item.page === pageNumber)
                        .map(textBox => (
                            <TextBox 
                                key={textBox.id}
                                data={textBox}
                            />
                        ))
                    }
                </div>
                {panel === 'erase' && !disableZoom && <div className='tools'>
                    <button className='btn-reset-view' onClick={() => {
                        canvasDrawRef?.resetView?.();
                    }}>Reset View
                    </button>
                </div>
                }</>
            </div>
        </div>
    );
}
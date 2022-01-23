import React, { useRef, useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
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
    // const [rehydrate, setRehydrate] = useState(false);
    const [pageLoaded, setPageLoaded] = useState<Record<number, boolean>>({});

    const pdfDataRef = useRef<PDFDocumentProxy>();
    // const listcanvasRef = useRef<any>([]);
    // const [listCanvasUrl, setListCanvasUrl] = useState<Record<number, string | undefined>>({});
    const listCanvasUrlRef = useRef<any>([]);

    let canvasDrawRef = null as any;

    useImperativeHandle(ref, () => ({
        undo: canvasDrawRef?.undo,
        clear: canvasDrawRef?.clear
    }));

    // const changePage = (offset: number) => {
    //     setPageLoaded(false);
    //     setCurrentPage(pageNumber + offset);
    //     setPageNumber(prevPageNumber => prevPageNumber + offset);
    // };

    // const previousPage = () => {
    //     changePage(-1);
    // };

    // const nextPage = () =>{
    //     changePage(1);
    // };

    useEffect(() => {
        listCanvasUrlRef.current = Array.from({length: 10}, (_, i) => i + 1)
            .map((idx) => listCanvasUrlRef.current[idx] = React.createRef<HTMLCanvasElement | null>());
    }, [pageNumber]);

    // useEffect(() => {
    //     if (rehydrate && pageLoaded) {
    //         setCanvasUrl(canvasRef.current?.toDataURL());
    //     }
    // },[pageNumber, canvasRef, rehydrate, pageLoaded]);

    const { canvasHeight, canvasWidth } = useImageSize(listCanvasUrlRef.current?.[0] ?? '');

    return (
        <div className="pdf-viewer">
            {/* <div className='header-tool'>
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
            </div> */}
            <div className='pdf-viewer-wrapper'>
                {/* {(!pageLoaded || !rehydrate) && <LoadingFullView size='large' />} */}
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
                    {Array.from(Array(10).keys()).map(pageNum => {
                        console.log('🚀 ~ file: index.tsx ~ line 110 ~ {Array.from ~ pageNum', pageNum);
                        return <Page pageNumber={pageNum + 1} scale={1.5}
                            onRenderSuccess={() => {
                                setPageLoaded(prev => {
                                    return {
                                        ...prev,
                                        [pageNum]: true
                                    };
                                });
                            }}
                            onRenderError={e => {
                                setPageLoaded(prev => {
                                    return {
                                        ...prev,
                                        [pageNum]: true
                                    };
                                });
                                // setRehydrate(true);
                            }} 
                            canvasRef={canvas => {
                                let hydrate = false;
                                const url = canvas?.toDataURL();
                                // console.log('page', pageNum, '🚀 ~ file: index.tsx ~ line 121 ~ url', url);
                                hydrate = true;
                                if (hydrate) {
                                    listCanvasUrlRef.current[pageNum] = url;
                                }
                                // canvasRef.current = canvas;
                                // setRehydrate(true);
                                // if (rehydrate) {
                                    
                                // }

                            }}
                        />;
                    })}
                </Document>
                {Array.from(Array(10).keys()).map(page => (
                    <div className='image-to-edit' ref={imageRef}>
                        {!pageLoaded[page] && <LoadingFullView />}
                        <CanvasDraw imgSrc={listCanvasUrlRef.current?.[page]}
                            canvasHeight={canvasHeight}
                            canvasWidth={canvasWidth}
                            hideGrid
                            ref={canvasDraw => (canvasDrawRef = canvasDraw)}
                            onChange={() => {}}
                            disabled={panel !== 'erase'}
                            brushColor={brushColor}
                            lazyRadius={1}
                            brushRadius={brushWidth}
                        />
                        {Object.values(textBoxs).filter(item => item.page === page + 1)
                            .map(textBox => (
                                <TextBox 
                                    key={textBox.id}
                                    data={textBox}
                                    draggable={textBoxDraggable}
                                />
                            ))
                        }
                    </div>
                ))
                }
            </div>
        </div>
    );
});
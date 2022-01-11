import React, { useContext } from 'react';
import moment from 'moment';
import { Document, Page, pdfjs } from 'react-pdf';
import { useHistory } from 'react-router-dom';
import { LoadingFullView, SideBar } from '../../../components';
import { ImageContext } from '../../../context';
import { FileData } from '../../../model';
import NoDataFoundPng from '../../../assets/nodata-found.png';
import './style.scss';


export function HistoryPage () {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const { setCurrentImage } = useContext(ImageContext);
    const history = useHistory();

    const listUploaded = JSON.parse(localStorage.getItem('uploadedList') ?? '[]') as FileData[];

    return (
        <div className='home-page-layout history-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <SideBar />
                <div className='main-content'>
                    <h3 className='title'>All projects</h3>
                    <div className='list-uploaded'>
                        {listUploaded.length > 0 ? listUploaded.map((item, idx) => (
                            <div className='image-item' key={item.created_at} onClick={() => {
                                setCurrentImage({
                                    url: item.url,
                                    type: item.type
                                });
                                history.push('/edit/text');
                            }}>
                                <div className='image-wrapper'>
                                    {item.type === 'application/pdf' 
                                        ? <Document
                                            file={item.url}
                                            loading={() => <LoadingFullView/>}
                                        >
                                            <Page pageNumber={1} scale={1} width={300} height={450}/>
                                            {/* {canvasUrl && <img src={canvasUrl} alt='img-editable'/>} */}
                                        </Document>
                                        : <img src={item.url} alt='uploaded-file'/>
                                    }
                                    <div className='hover-text'>Continue editting image</div>
                                </div>
                                <div className='name'>{item.original_filename ?? 'Image File'}</div>
                                <div className='time'>{moment(item.created_at).fromNow()}</div>
                            </div>
                        )): <div className='no-data-panel'>
                            <img src={NoDataFoundPng} alt='No data found'/>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
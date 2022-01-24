import React, { useContext, useState } from 'react';
import uniqid from 'uniqid';
import moment from 'moment';
import { RcFile } from 'antd/lib/upload';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, notification, Upload } from 'antd';
import { useHistory } from 'react-router-dom';
import { LoadingFullView, SideBar } from '../../../components';
import { DataAccess } from '../../../access';
import { ImageContext, TextBoxContext } from '../../../context';
import { FileData } from '../../../model';
import backgroundImage from '../../../assets/bg-img.png';
import './style.scss';

export function HomePage () {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const { setCurrentImage } = useContext(ImageContext);
    const { setTextBoxs } = useContext(TextBoxContext);
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const listUploaded = JSON.parse(localStorage.getItem('uploadedList') ?? '{}') as Record<string, FileData>;
    const latestProjects = Object.values(listUploaded)?.slice(0, 3);

    return (
        <div className='home-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <img src={backgroundImage} alt='girl-background' className='bg-img'/>
                <SideBar />
                <div className='main-content'>
                    <div className='content-box'>
                        <Upload.Dragger showUploadList={false} maxCount={1} accept='image/*,application/pdf'
                            customRequest={async ({file}) => {
                                try {
                                    setLoading(true);
                                    let formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('upload_preset', 'yj7nifwi');
                                    const res = await DataAccess.uploadImage(formData);
                                    if (res?.data) {
                                        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}');
                                        const id = uniqid();
                                        setCurrentImage({
                                            id: id,
                                            url: res?.data?.secure_url,
                                            type: (file as RcFile).type,
                                            original_filename: res?.data?.original_filename,
                                            created_at: res?.data?.created_at,
                                            drawSaveData: undefined
                                        });
                                        localStorage.setItem('uploadedList', JSON.stringify({
                                            [id]: {
                                                id: id,
                                                url: res?.data?.secure_url,
                                                original_filename: res?.data?.original_filename,
                                                created_at: res?.data?.created_at,
                                                type: (file as RcFile).type,
                                                textBoxs: {},
                                                drawSaveData: undefined
                                            }, ...uploadedList
                                        }));
                                        history.push('/edit/text');
                                    }
                                } catch (e) {
                                    notification.error({
                                        message: 'Upload Image Failed'
                                    });
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                            <div className='title'>
                                {'Manga Editor & Auto-translator'}
                            </div>
                            <p className='welcome'>
                                {'Welcome to Manga Editor & Auto-translator.'}
                                <br/>Start editing by clicking on the open photo button, or drag n' drop a file.
                            </p>
                            <Button type='primary' shape='round' loading={loading}>Open Image</Button>
                        </Upload.Dragger>
                    </div>
                    {latestProjects.length !== 0 && <div className='lastest-projects'>
                        <div className='title'>
                            Latest Projects
                        </div>
                        <div className='list-images'>
                            {latestProjects.map(item => (
                                <div className='image-item' key={item.created_at} onClick={() => {
                                    setCurrentImage({
                                        url: item.url,
                                        type: item.type,
                                        created_at: item.created_at,
                                        id: item.id,
                                        original_filename: item.original_filename,
                                        drawSaveData: item.drawSaveData
                                    });
                                    setTextBoxs(item.textBoxs);
                                    history.push('/edit/text');
                                }}>
                                    <div className='image-wrapper'>
                                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
                                        {item.type === 'application/pdf' 
                                            ? <Document
                                                file={item.url}
                                                loading={() => <LoadingFullView/>}
                                            >
                                                <Page pageNumber={1} scale={1} width={200} height={300}/>
                                                {/* {canvasUrl && <img src={canvasUrl} alt='img-editable'/>} */}
                                            </Document>
                                            : <img src={item.url} alt='uploaded-file'/>
                                        }
                                        <div className='hover-text'>Continue editting image</div>
                                    </div>
                                    <div className='name'>{item.original_filename ?? 'Image File'}</div>
                                    <div className='time'>{moment(item.created_at).fromNow()}</div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};
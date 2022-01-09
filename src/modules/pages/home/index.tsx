import React, { useContext, useState } from 'react';
import { Button, notification, Upload } from 'antd';
import { useHistory } from 'react-router-dom';
import { SideBar } from '../../../components';
import backgroundImage from '../../../assets/bg-img.png';
import { DataAccess } from '../../../access';
import { ImageContext } from '../../../context';
import { FileData } from '../../../model';
import './style.scss';
import moment from 'moment';

export function HomePage () {
    const {setImageUrl} = useContext(ImageContext);
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const lastestProjects = JSON.parse(localStorage.getItem('uploadedList') ?? '[]').slice(0, 3) as FileData[];
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
                        <Upload.Dragger showUploadList={false} maxCount={1} accept='image/*'
                            customRequest={async ({file}) => {
                                try {
                                    setLoading(true);
                                    let formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('upload_preset', 'yj7nifwi');
                                    const res = await DataAccess.uploadImage(formData);
                                    if (res?.data) {
                                        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
                                        localStorage.setItem('uploadedList', JSON.stringify([{
                                            url: res?.data?.secure_url,
                                            original_filename: res?.data?.original_filename,
                                            created_at: res?.data?.created_at
                                        }, ...uploadedList]));
                                        setImageUrl(res?.data?.secure_url);
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
                    {lastestProjects.length !== 0 && <div className='lastest-projects'>
                        <div className='title'>
                            Lastest Projects
                        </div>
                        <div className='list-images'>
                            {lastestProjects.map(item => (
                                <div className='image-item' key={item.created_at} onClick={() => {
                                    setImageUrl(item.url);
                                    history.push('/edit/text');
                                }}>
                                    <div className='image-wrapper'>
                                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
                                        <img src={item.url} alt='Image'/>
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
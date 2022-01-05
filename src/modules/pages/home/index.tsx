import React, { useContext, useState } from 'react';
import { Button, notification, Upload } from 'antd';
import { SideBar } from '../../../components';
import backgroundImage from '../../../assets/bg-img.png';
import './style.scss';
import { DataAccess } from '../../../access';
import { ImageContext } from '../../../context';
import { useHistory } from 'react-router-dom';

export function HomePage () {
    const {setImageUrl} = useContext(ImageContext);
    const history = useHistory();

    const [loading, setLoading] = useState(false);
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
                                    if (res?.data?.url) {
                                        setImageUrl(res?.data?.url ?? '');
                                        // localStorage.setItem('imageUrl', res?.data?.url);
                                        history.push('/edit');
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
                </div>
            </div>
        </div>
    );
};
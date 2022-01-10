import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notification, Popover, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faImages } from '@fortawesome/free-solid-svg-icons';
import { ImageContext } from '../../../../context';
import { DataAccess } from '../../../../access';
import './style.scss';


export const TranslateSideBar = () => {
    const history = useHistory();
    const { setImageUrl } = useContext(ImageContext);
    const [loading, setLoading] = useState(false);
    return (
        <div className='edit-side-bar'>
            <div className='home-button' onClick={() => {
                setImageUrl('');
                history.push('/');
            }}>
                <FontAwesomeIcon icon={faHome}/>
            </div>
            <div className='splitter'/>
            <div className='menu'>
            </div>
            <div className='splitter'/>
            <Upload className='side-bar-upload' showUploadList={false} maxCount={1} accept='image/*'
                customRequest={async ({file}) => {
                    try {
                        setLoading(true);
                        let formData = new FormData();
                        formData.append('file', file);
                        formData.append('upload_preset', 'yj7nifwi');
                        const res = await DataAccess.uploadImage(formData);
                        if (res?.data) {
                            setImageUrl(res?.data?.secure_url);
                            const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
                            localStorage.setItem('uploadedList', JSON.stringify([{
                                url: res?.data?.secure_url,
                                original_filename: res?.data?.original_filename,
                                created_at: res?.data?.created_at
                            }, ...uploadedList]));
                        }
                    } catch (e) {
                        notification.error({
                            message: 'Upload Image Failed'
                        });
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <Popover content='Change Image' overlayClassName='custom-tooltip' placement='right'>
                    {loading ? <LoadingOutlined /> : <FontAwesomeIcon icon={faImages}/>}
                </Popover>
            </Upload>
        </div>
    );
};
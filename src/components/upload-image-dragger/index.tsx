import React, { useContext, useState } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Upload } from 'antd';
import { DataAccess } from '../../access';
import { ImageContext } from '../../context';

export const UploadImageDragger = () => {
    const { setImageUrl } = useContext(ImageContext);
    const [loading, setLoading] = useState(false);
    return (
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
                        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
                        localStorage.setItem('uploadedList', JSON.stringify([...uploadedList, res?.data?.url]));
                    }
                } catch (e) {
                    notification.error({
                        message: 'Upload Image Failed'
                    });
                } finally {
                    setLoading(false);
                }
            }}>
            <FontAwesomeIcon icon={faExclamationTriangle}/>
            <div className='title'>
                Please upload an image to start editing
            </div>
            <p className='welcome'>
                Upload image by clicking on the open photo button, or drag n' drop a file.
            </p>
            <Button type='primary' shape='round' loading={loading}>Open Image</Button>
        </Upload.Dragger>
    );
};
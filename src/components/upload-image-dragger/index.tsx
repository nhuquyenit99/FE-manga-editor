import React, { useContext, useState } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Upload } from 'antd';
import { DataAccess } from '../../access';
import { ImageContext } from '../../context';
import { useHistory } from 'react-router-dom';

export const UploadImageDragger = () => {
    const { setImageUrl } = useContext(ImageContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    return (
        <Upload.Dragger showUploadList={false} maxCount={1} accept='image/*'
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
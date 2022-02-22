import React, { useContext, useState } from 'react';
import uniqid from 'uniqid';
import { useHistory } from 'react-router-dom';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { DataAccess } from '../../access';
import { ImageContext } from '../../context';

export const UploadImageDragger = ({type = 'edit'}: {type?: 'edit' | 'translate'}) => {
    const { setCurrentImage, setTextBoxs, setDrawSaveData } = useContext(ImageContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    return (
        <Upload.Dragger showUploadList={false} maxCount={1} accept='image/*,application/pdf'
            customRequest={async ({file}) => {
                try {
                    setLoading(true);
                    let formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'yj7nifwi');
                    const res = await DataAccess.uploadImage(formData);
                    if (res?.data) {
                        const id = uniqid();
                        setCurrentImage({
                            id: id,
                            url: res?.data?.secure_url,
                            type: (file as RcFile).type,
                            original_filename: res?.data?.original_filename,
                            created_at: res?.data?.created_at,
                        });
                        setTextBoxs({});
                        setDrawSaveData({});
                        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}');
                        localStorage.setItem('uploadedList', JSON.stringify({
                            [id]: {
                                id: id,
                                url: res?.data?.secure_url,
                                original_filename: res?.data?.original_filename,
                                created_at: res?.data?.created_at,
                                type: (file as RcFile).type,
                                textBoxs: {},
                                drawSaveData: undefined
                            }, 
                            ...uploadedList
                        }));
                        if (type === 'edit') {
                            history.push('/edit/text');
                        } else {
                            history.push('/translate');
                        }
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
                {`Please upload an image to start ${type === 'edit' ? 'editting' : 'translating'}`}
            </div>
            <p className='welcome'>
                Upload image by clicking on the open photo button, or drag n' drop a file.
            </p>
            <Button type='primary' shape='round' loading={loading}>Open Image</Button>
        </Upload.Dragger>
    );
};
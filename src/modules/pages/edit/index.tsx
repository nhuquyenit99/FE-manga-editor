import React, { useContext, useState } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Upload } from 'antd';
import { CropperImagePanel, InsertTextPanel } from '../../../components';
import { EditSideBar } from './side-bar';
import './style.scss';
import { ImageContext } from '../../../context';
import { DataAccess } from '../../../access';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { imageUrl, setImageUrl } = useContext(ImageContext);

    const [action, setAction] = useState<EditAction>('crop');
    if (!imageUrl) {
        return (
            <div className='edit-page-layout'>
                <EditSideBar 
                    action={action}
                    setAction={setAction}
                />
                <div className='main-content'>
                    <div className='upload-image-panel'>
                        <Upload.Dragger showUploadList={false} maxCount={1} accept='image/*'
                            customRequest={async ({file}) => {
                                try {
                                    let formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('upload_preset', 'yj7nifwi');
                                    const res = await DataAccess.uploadImage(formData);
                                    if (res?.data?.url) {
                                        setImageUrl(res?.data?.url ?? '');
                                    }
                                } catch (e) {
                                    notification.error({
                                        message: 'Upload Image Failed'
                                    });
                                }
                            }}>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                            <div className='title'>
                                Please upload an image to start editing
                            </div>
                            <p className='welcome'>
                                Upload image by clicking on the open photo button, or drag n' drop a file.
                            </p>
                            <Button type='primary' shape='round'>Open Image</Button>
                        </Upload.Dragger>
                    </div>
                </div>
            </div>
        );
    }
    const Panel = EditPanel[action];
    return (
        <div className='edit-page-layout'>
            <EditSideBar 
                action={action}
                setAction={setAction}
            />
            <div className='main-content'>
                <Panel />
            </div>
        </div>
    );
};

const EditPanel: Record<EditAction, React.ComponentType> = {
    crop: CropperImagePanel,
    text: InsertTextPanel,
    draw: () => <div style={{color: 'white'}}>Draw Panel</div>,
    erase: () => <div style={{color: 'white'}}>Erase Panel</div>
};
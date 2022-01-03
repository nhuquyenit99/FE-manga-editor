import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Upload } from 'antd';
import { useParams } from 'react-router-dom';
import { CropperImagePanel } from '../../../components';
import { EditSideBar } from './side-bar';
import './style.scss';

export const EditPage = () => {
    let { id } = useParams<{ id: string }>();
    console.log('🚀 ~ file: index.tsx ~ line 12 ~ EditPage ~ id', id);
    if (!id) {
        return (
            <div className='edit-page-layout'>
                <EditSideBar />
                <div className='main-content'>
                    <div className='upload-image-panel'>
                        <Upload.Dragger >
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
    return (
        <div className='edit-page-layout'>
            <CropperImagePanel />

        </div>

    );
};
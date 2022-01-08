import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notification, Popover, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPencilAlt, faHome, faFont, faImages } from '@fortawesome/free-solid-svg-icons';
import { ImageContext } from '../../../../context';
import { mergeClass } from '../../../../utils';
import { DataAccess } from '../../../../access';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

type EditSidebarProps = {
    action: EditAction;
}

export const EditSideBar = ({action}: EditSidebarProps) => {
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
                <Popover content='Add text' key='text' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='text' ? 'active' : '')} 
                        onClick={() => history.push('/edit/text')}>
                        <FontAwesomeIcon icon={faFont}/>
                    </div>
                </Popover>
                {/* <Popover content='Crop image' key='crop' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='crop' ? 'active' : '')} 
                        onClick={() => history.push('/edit/crop')}>
                        <FontAwesomeIcon icon={faCrop}/>
                    </div>
                </Popover> */}
                <Popover content='Eraser' key='eraser' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='erase' ? 'active' : '')} 
                        onClick={() => history.push('/edit/erase')}> 
                        <FontAwesomeIcon icon={faEraser}/>
                    </div>
                </Popover>
                <Popover content='Draw' key='draw' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='draw' ? 'active' : '')} 
                        onClick={() => history.push('/edit/draw')}> 
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </div>
                </Popover>
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
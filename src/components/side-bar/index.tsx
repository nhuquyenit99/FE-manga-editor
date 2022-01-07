import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { faGlobe, faHistory, faHome, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Popover, Upload } from 'antd';
import { mergeClass } from '../../utils';
import { ImageContext } from '../../context';
import { DataAccess } from '../../access';
import './style.scss';

export const SideBar = () => {
    const history = useHistory();
    const pathName = history.location.pathname;

    const {setImageUrl} = useContext(ImageContext);

    const [loading, setLoading] = useState(false);

    return (
        <div className='side-bar'>
            <div className='head-banner'>
                <span>MangaEd</span>
            </div>
            <div className='menu'>
                <Link className={mergeClass('menu-button', pathName === '/' ? 'active' : '')}
                    to='/' key='/'>
                    <FontAwesomeIcon icon={faHome}/>
                    <b>HOME</b>
                </Link>
                <Link className={mergeClass('menu-button', pathName === '/translate' ? 'active' : '')}  
                    to='/translate' key='/translate'>
                    <FontAwesomeIcon icon={faGlobe}/>
                    <b>TRANS</b>
                </Link>
                <Link className={mergeClass('menu-button', pathName === '/edit' ? 'active' : '')}  
                    to='/edit' key='/edit'>
                    <FontAwesomeIcon icon={faPenNib}/>
                    <b>EDIT</b>
                </Link>
                <Link className={mergeClass('menu-button', pathName === '/history' ? 'active' : '')} 
                    to='/history' key='/history'>
                    <FontAwesomeIcon icon={faHistory}/>
                    <b>HISTORY</b>
                </Link>
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
                            history.push('/edit/text');
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
                <Popover content='Open Image' overlayClassName='custom-tooltip' placement='right'>
                    <Button type='primary' shape='circle' className='home-open-image' loading={loading}>
                        {!loading  && <FontAwesomeIcon icon={faPlus}/>}
                    </Button>
                </Popover>
            </Upload>
        </div>
    );
};
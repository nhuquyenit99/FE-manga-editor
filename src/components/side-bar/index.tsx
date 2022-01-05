import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { faGlobe, faHistory, faHome, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, notification, Popover, Upload } from 'antd';
import { mergeClass } from '../../utils';
import { ImageContext } from '../../context';
import './style.scss';
import { DataAccess } from '../../access';

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
                <Link className={mergeClass('menu-button', pathName === '/history' ? 'active' : '')} 
                    to='/history' key='/history'>
                    <FontAwesomeIcon icon={faHistory}/>
                    <b>HISTORY</b>
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
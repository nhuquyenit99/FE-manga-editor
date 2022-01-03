import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { faGlobe, faHistory, faHome, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Upload } from 'antd';
import { mergeClass } from '../../utils';
import './style.scss';

export const SideBar = () => {
    const history = useHistory();
    const pathName = history.location.pathname;
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
            <Upload className='side-bar-upload'>
                <Popover content='Open Image' overlayClassName='custom-tooltip' placement='right'>
                    <Button type='primary' shape='circle' className='home-open-image'>
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                </Popover>
            </Upload>
        </div>
    );
};
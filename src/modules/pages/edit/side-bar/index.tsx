import React from 'react';
import { Popover } from 'antd';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPencilAlt, faHome, faCrop, faFont } from '@fortawesome/free-solid-svg-icons';
import './style.scss';

export const EditSideBar = () => {
    return (
        <div className='edit-side-bar'>
            <Link className='home-button' to='/'>
                <FontAwesomeIcon icon={faHome}/>
            </Link>
            <div className='splitter'/>
            <div className='menu'>
                <Popover content='Crop image' key='crop' overlayClassName='custom-tooltip' placement='right'>
                    <div className='menu-button active' >
                        <FontAwesomeIcon icon={faCrop}/>
                    </div>
                </Popover>
                <Popover content='Add text' key='text' overlayClassName='custom-tooltip' placement='right'>
                    <div className='menu-button' >
                        <FontAwesomeIcon icon={faFont}/>
                    </div>
                </Popover>
                <Popover content='Draw' key='draw' overlayClassName='custom-tooltip' placement='right'>
                    <div className='menu-button' > 
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </div>
                </Popover>
                <Popover content='Eraser' key='eraser' overlayClassName='custom-tooltip' placement='right'>
                    <div className='menu-button' > 
                        <FontAwesomeIcon icon={faEraser}/>
                    </div>
                </Popover>
            </div>
        </div>
    );
};
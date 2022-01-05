import React, { useContext } from 'react';
import { Popover } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faPencilAlt, faHome, faCrop, faFont } from '@fortawesome/free-solid-svg-icons';
import './style.scss';
import { ImageContext } from '../../../../context';
import { mergeClass } from '../../../../utils';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

type EditSidebarProps = {
    action: EditAction;
    setAction: (action: EditAction) => void
}

export const EditSideBar = ({action, setAction}: EditSidebarProps) => {
    const history = useHistory();
    const { setImageUrl } = useContext(ImageContext);
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
                <Popover content='Crop image' key='crop' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='crop' ? 'active' : '')} 
                        onClick={() => setAction('crop')}>
                        <FontAwesomeIcon icon={faCrop}/>
                    </div>
                </Popover>
                <Popover content='Add text' key='text' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='text' ? 'active' : '')} 
                        onClick={() => setAction('text')}>
                        <FontAwesomeIcon icon={faFont}/>
                    </div>
                </Popover>
                <Popover content='Draw' key='draw' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='draw' ? 'active' : '')} 
                        onClick={() => setAction('draw')}> 
                        <FontAwesomeIcon icon={faPencilAlt}/>
                    </div>
                </Popover>
                <Popover content='Eraser' key='eraser' overlayClassName='custom-tooltip' placement='right'>
                    <div className={mergeClass('menu-button', action ==='erase' ? 'active' : '')} 
                        onClick={() => setAction('erase')}> 
                        <FontAwesomeIcon icon={faEraser}/>
                    </div>
                </Popover>
            </div>
        </div>
    );
};
import React from 'react';
import { Button, Popover, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPenNib, faHistory, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../../assets/bg-img.png';
import './style.scss';

export function HomePage () {
    return (
        <div className='home-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <img src={backgroundImage} alt='girl-background' className='bg-img'/>
                <div className='side-bar'>
                    <div className='head-banner'>
                        <span>MangaEd</span>
                    </div>
                    <div className='menu'>
                        <div className='menu-button active'>
                            <FontAwesomeIcon icon={faHome}/>
                            <b>HOME</b>
                        </div>
                        <div className='menu-button'>
                            <FontAwesomeIcon icon={faHistory}/>
                            <b>HISTORY</b>
                        </div>
                        <div className='menu-button'>
                            <FontAwesomeIcon icon={faGlobe}/>
                            <b>TRANS</b>
                        </div>
                        <div className='menu-button'>
                            <FontAwesomeIcon icon={faPenNib}/>
                            <b>EDIT</b>
                        </div>
                        
                    </div>
                    <div className='splitter'/>
                    <Popover content='Open Image' overlayClassName='custom-tooltip' placement='right'>
                        <Button type='primary' shape='circle' className='home-open-image'>
                            <FontAwesomeIcon icon={faPlus}/>
                        </Button>
                    </Popover>
                </div>
                <div className='main-content'>
                    <div className='content-box'>
                        <Upload.Dragger>
                            <div className='title'>
                                {'Manga Editor & Auto-translator'}
                            </div>
                            <p className='welcome'>
                                {'Welcome to Manga Editor & Auto-translator.'}
                                <br/>Start editing by clicking on the open photo button, or drag n' drop a file.
                            </p>
                            <Button type='primary' shape='round'>Open Image</Button>
                        </Upload.Dragger>
                    </div>
                </div>
            </div>
        </div>
    );
};
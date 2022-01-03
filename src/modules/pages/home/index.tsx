import React from 'react';
import { Button, Upload } from 'antd';
import { SideBar } from '../../../components';
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
                <SideBar />
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
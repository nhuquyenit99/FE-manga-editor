import React from 'react';
import { Button, Upload } from 'antd';
import { SideBar } from '../../../components';
import backgroundImage from '../../../assets/bg-img.png';

export function HistoryPage () {
    return (
        <div className='home-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <img src={backgroundImage} alt='girl-background' className='bg-img'/>
                <SideBar />
                <div className='main-content'>
                    History
                </div>
            </div>
        </div>
    );
};
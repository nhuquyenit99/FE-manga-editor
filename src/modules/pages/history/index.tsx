import React from 'react';
import { Button, Upload } from 'antd';
import { SideBar } from '../../../components';
import backgroundImage from '../../../assets/bg-img.png';

export function HistoryPage () {
    const listUploaded = JSON.parse(localStorage.getItem('listUploaded') ?? '[]') as string[];
    return (
        <div className='home-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <img src={backgroundImage} alt='girl-background' className='bg-img'/>
                <SideBar />
                <div className='main-content'>
                    <div className='list-uploaded'>
                        {listUploaded.map((item, idx) => (
                            <div className='image-wrapper'>
                                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
                                <img src={item} alt='An uploaded image'/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
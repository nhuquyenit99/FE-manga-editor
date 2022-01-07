import React from 'react';
import { SideBar } from '../../../components';
import backgroundImage from '../../../assets/bg-img.png';
import './style.scss';
import { useContext } from 'react';
import { ImageContext } from '../../../context';
import { useHistory } from 'react-router-dom';

export function HistoryPage () {
    const { setImageUrl } = useContext(ImageContext);
    const history = useHistory();

    const listUploaded = JSON.parse(localStorage.getItem('uploadedList') ?? '[]') as string[];

    return (
        <div className='home-page-layout history-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <img src={backgroundImage} alt='girl-background' className='bg-img'/>
                <SideBar />
                <div className='main-content'>
                    <div className='list-uploaded'>
                        {listUploaded.map((item, idx) => (
                            <div className='image-wrapper' key={`${item}-${idx}`} onClick={() => {
                                setImageUrl(item);
                                history.push('/edit/text');
                            }}>
                                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
                                <img src={item} alt='Image'/>
                                <div className='hover-text'>Continue editting image</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
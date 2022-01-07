import React, { useContext } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { SideBar } from '../../../components';
import { ImageContext } from '../../../context';
import NoDataFoundPng from '../../../assets/nodata-found.png';
import './style.scss';

type FileData = {
    url: string
    original_filename: string
    created_at: string
}

export function HistoryPage () {
    const { setImageUrl } = useContext(ImageContext);
    const history = useHistory();

    const listUploaded = JSON.parse(localStorage.getItem('uploadedList') ?? '[]') as FileData[];

    return (
        <div className='home-page-layout history-page-layout'>
            <div className='header'>
                <div className='title'>MANGA EDITOR</div>
            </div>
            <div className='content-body'>
                <SideBar />
                <div className='main-content'>
                    <h3 className='title'>All projects</h3>
                    <div className='list-uploaded'>
                        {listUploaded.length > 0 ? listUploaded.map((item, idx) => (
                            <div className='image-item' key={item.created_at} onClick={() => {
                                setImageUrl(item.url);
                                history.push('/edit/text');
                            }}>
                                <div className='image-wrapper'>
                                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
                                    <img src={item.url} alt='Image'/>
                                    <div className='hover-text'>Continue editting image</div>
                                </div>
                                <div className='name'>{item.original_filename ?? 'Image File'}</div>
                                <div className='time'>{moment(item.created_at).fromNow()}</div>
                            </div>
                        )): <div className='no-data-panel'>
                            <img src={NoDataFoundPng} alt='No data found'/>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
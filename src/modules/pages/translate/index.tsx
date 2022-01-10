import React, { useCallback, useContext, useRef } from 'react';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { useHistory } from 'react-router-dom';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { 
    UploadImageDragger, 
    ExportImageModal, 
} from '../../../components';
import { ImageContext } from '../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateSideBar } from './side-bar';
import './style.scss';


export const TranslatePage = () => {
    const { imageUrl, setImageUrl } = useContext(ImageContext);
    const history = useHistory();

    const imageRef = useRef<any>();
    const saveModelRef = useRef<any>();
    const zoomRef = React.createRef<ReactZoomPanPinchRef>();

    const onExport = useCallback(async (fileName: string, extension: '.jpg' | '.png' | '.svg') => {
        let dataUrl;
        switch(extension) {
        case '.jpg': 
            dataUrl = await toJpeg(imageRef.current, { cacheBust: true, });
            break;
        case '.png': 
            dataUrl = await toPng(imageRef.current, { cacheBust: true, });
            break;
        case '.svg': 
            dataUrl = await toSvg(imageRef.current, { cacheBust: true, });
            break;
        }
        const link = document.createElement('a');
        link.download = `${fileName}${extension}`;
        link.href = dataUrl;
        link.click();
        const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '[]');
        localStorage.setItem('uploadedList', JSON.stringify([{
            url: dataUrl,
            original_filename: fileName,
            created_at: moment().toISOString()
        }, ...uploadedList]));
    },[imageRef]);

    if (!imageUrl) {
        return (
            <div className='edit-page-layout'>
                <TranslateSideBar />
                <div className='main-content'>
                    <div className='header'>
                        <div className='title'>Translate Page</div>  
                        <div className='suffix'>
                            <Button shape='round' onClick={() => {
                                setImageUrl('');
                                history.push('/');
                            }} >Cancel</Button>
                        </div>
                    </div>
                    <div className='upload-image-panel'>
                        <UploadImageDragger type='translate'/>
                    </div>
                </div>
            </div>
        );
    }

    
    return (
        <div className='edit-page-layout'>
            <TranslateSideBar />
            <div className='main-content'>
                <div className='header'>
                    <div className='title'>Translate Page</div>  
                    <div className='suffix'>
                        <Button shape='round' onClick={() => {
                            setImageUrl('');
                            history.push('/');
                        }} >Cancel</Button>
                        {imageUrl && 
                        <Dropdown trigger={['click']} overlay={<Menu>
                            <Menu.Item onClick={() => {
                                zoomRef.current?.resetTransform();
                                saveModelRef.current?.open();
                            }}>
                                Export
                            </Menu.Item>
                        </Menu>}>
                            <Button shape='round'>Menu <DownOutlined /></Button>
                        </Dropdown>}
                    </div>
                </div>
                <div className='edit-panel-content'>
                    <div className='workspace'>
                        {/* <TransformWrapper
                            minScale={0.2}
                            maxScale={3}
                            ref={zoomRef}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <div className='image-panel-wrapper'>
                                    <div className='image-wrapper'>
                                        <TransformComponent>
                                            <img src={imageUrl} alt='manga-img' className='image-to-edit'/>       
                                        </TransformComponent>
                                    </div>
                                    <div className="tools">
                                        <Tooltip title='Zoom In' placement='left'>
                                            <button onClick={() => zoomIn()} ><FontAwesomeIcon icon={faSearchPlus}/></button>
                                        </Tooltip>
                                        <Tooltip title='Zoom Out' placement='left'>
                                            <button onClick={() => zoomOut()} ><FontAwesomeIcon icon={faSearchMinus}/></button>
                                        </Tooltip>
                                        <Tooltip title='Reset' placement='left'>
                                            <button onClick={() => resetTransform()}><FontAwesomeIcon icon={faTimes}/></button>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                        </TransformWrapper> */}
                        <ExportImageModal 
                            onSave={onExport}
                            ref={saveModelRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
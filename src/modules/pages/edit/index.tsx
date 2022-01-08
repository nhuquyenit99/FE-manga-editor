import React, { useCallback, useContext, useRef, useState } from 'react';
import moment from 'moment';
import CanvasDraw from 'react-canvas-draw';
import { Button } from 'antd';
import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { CropperImagePanel, InsertTextPanel, UploadImageDragger, TextBox, ExportImageModal } from '../../../components';
import { ImageContext, TextBoxContext } from '../../../context';
import { getImageMeta } from '../../../utils';
import { TextBoxData } from '../../../model';
import { EditSideBar } from './side-bar';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { imageUrl, setImageUrl } = useContext(ImageContext);

    let { panel } = useParams<{panel: EditAction}>();
    const history = useHistory();

    const imageRef = useRef<any>();
    const saveModelRef = useRef<any>();

    const [textBoxs, setTextBoxs] = useState<Record<string, TextBoxData>>({});
    const [activeTextBox, setActiveTextBox] = useState<string>('');

    const removeTextBox = (id: string) => {
        let list = {...textBoxs};
        delete list[id];
        setTextBoxs(list);
        if (activeTextBox === id) {
            setActiveTextBox('');
        }
    };

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

    if (!panel) {
        return <Redirect to='/edit/text'/>;
    }

    if (!imageUrl) {
        return (
            <div className='edit-page-layout'>
                <EditSideBar 
                    action={panel}
                />
                <div className='main-content'>
                    <div className='header'>
                        <div className='title'>Edit Page</div>  
                        <div className='suffix'>
                            <Button shape='round' onClick={() => {
                                setImageUrl('');
                                history.push('/');
                            }} >Cancel</Button>
                        </div>
                    </div>
                    <div className='upload-image-panel'>
                        <UploadImageDragger />
                    </div>
                </div>
            </div>
        );
    }
    const Panel = EditPanel[panel];
    return (
        <div className='edit-page-layout'>
            <EditSideBar 
                action={panel}
            />
            <div className='main-content'>
                <div className='header'>
                    <div className='title'>Edit Page</div>  
                    <div className='suffix'>
                        <Button shape='round' onClick={() => {
                            setImageUrl('');
                            history.push('/');
                        }} >Cancel</Button>
                        {imageUrl && <Button type='primary' onClick={() => saveModelRef.current?.open()} shape='round'>
                            Export
                        </Button>}
                    </div>
                </div>
                <div className='edit-panel-content'>
                    <TextBoxContext.Provider
                        value={{
                            activeId: activeTextBox,
                            setActiveId: setActiveTextBox,
                            removeTextBox: removeTextBox,
                            textBoxs: textBoxs,
                            setTextBoxs: setTextBoxs
                        }}
                    >
                        <Panel />
                        <div className='workspace'>
                            <div className='image-to-edit' ref={imageRef}>
                                {panel === 'erase' ? <CanvasDraw imgSrc={imageUrl}
                                    {...getImageMeta(imageUrl)}
                                    brushColor="white"
                                /> 
                                    : <img src={imageUrl} alt='img-to-edit' draggable={false}/>
                                }
                                {Object.values(textBoxs).map(textBox => (
                                    <TextBox 
                                        key={textBox.id}
                                        data={textBox}
                                    />
                                ))}
                            </div>
                            <ExportImageModal 
                                onSave={onExport}
                                ref={saveModelRef}
                            />
                        </div>
                    </TextBoxContext.Provider>
                </div>
            </div>
        </div>
    );
};

const EditPanel: Record<EditAction, React.ComponentType> = {
    crop: CropperImagePanel,
    text: InsertTextPanel,
    draw: () => <div style={{color: 'white'}}>Draw Panel</div>,
    erase: () => <div style={{color: 'white'}}>Erase Panel</div>
};
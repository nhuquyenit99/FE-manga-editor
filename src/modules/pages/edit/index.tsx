import React, { useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { CropperImagePanel, InsertTextPanel, UploadImageDragger } from '../../../components';
import { ImageContext } from '../../../context';
import { EditSideBar } from './side-bar';
import './style.scss';

type EditAction = 'crop' | 'text' | 'draw' | 'erase';

export const EditPage = () => {
    const { imageUrl } = useContext(ImageContext);
    let { panel } = useParams<{panel: EditAction}>();

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
                <Panel />
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
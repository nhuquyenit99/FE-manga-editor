import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import Cropper from 'react-cropper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCropAlt, faSearchPlus, 
    faSearchMinus, faRedoAlt, 
    faUndoAlt, faArrowsAltV, 
    faArrowsAltH, faMousePointer
} from '@fortawesome/free-solid-svg-icons';
import 'cropperjs/dist/cropper.css';
import './style.scss';
import { ImageContext } from '../../context';

const defaultSrc =
  'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';

export const CropperImagePanel = () => {
    const {imageUrl} = useContext(ImageContext);
    const [image, setImage] = useState(imageUrl);
    const [cropData, setCropData] = useState('');
    const [cropper, setCropper] = useState<any>();
    const [mode, setMode] = useState<'move'| 'crop'>('move');
    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (cropper) {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const onCrop = () => {
        if (cropper) {
            cropper.setDragMode('crop');
            setMode('crop');
        }
    };

    const onMove = () => {
        if (cropper) {
            cropper.setDragMode('move');
            setMode('move');
        }
    };

    const onZoomIn = () => {
        if (cropper) {
            cropper.zoom(0.1);
        }
    };

    const onZoomOut = () => {
        if (cropper) {
            cropper.zoom(-0.1);
        }
    };

    const onRotateLeft = () => {
        if (cropper) {
            cropper.rotate(-90);
        }
    };

    const onRotateRight = () => {
        if (cropper) {
            cropper.rotate(90);
        }
    };

    const onFlipHorizontal = () => {
        if (cropper) {
            cropper.scaleX(-cropper.getData().scaleX || -1);
        }
    };

    const onFlipVertical = () => {
        if (cropper) {
            cropper.scaleY(-cropper.getData().scaleY || -1);
        }
    };

    return (
        <div className='image-cropper'>
            {/* <input type="file" onChange={onChange} />
                <button>Use default img</button>
                <br />
                <br /> */}
            <div className='header'>
                <div className='title'>CROPPER</div>  
                {mode === 'crop' && <div className='content-right'>
                    <Button type='primary' shape='round'>Save</Button>
                    <Button shape='round'>Cancel</Button>
                </div>}
            </div>
            <div className='cropper-wrapper'>
                <Cropper
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    minCanvasHeight={800}
                    // preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCrop={false}
                    // autoCropArea={1}
                    checkOrientation={false}
                    onInitialized={(instance) => {
                        setCropper(instance);
                    }}
                    dragMode='move'
                    guides={true}
                />
            </div>

            <div className="crop-toolbox">
                <button onClick={onMove}><FontAwesomeIcon icon={faMousePointer} /></button>
                <button onClick={onCrop}><FontAwesomeIcon icon={faCropAlt} /></button>
                <button onClick={onZoomIn}><FontAwesomeIcon icon={faSearchPlus} /></button>
                <button onClick={onZoomOut}><FontAwesomeIcon icon={faSearchMinus} /></button>
                <button onClick={onRotateLeft}><FontAwesomeIcon icon={faRedoAlt} /></button>
                <button onClick={onRotateRight}><FontAwesomeIcon icon={faUndoAlt} /></button>
                <button onClick={onFlipHorizontal}><FontAwesomeIcon icon={faArrowsAltH} /></button>
                <button onClick={onFlipVertical}><FontAwesomeIcon icon={faArrowsAltV} /></button>
                {/* <h1>
                    <span>Crop</span>
                </h1>
                <div>
                    {cropData && <img src={cropData} alt="cropped" />}
                </div> */}
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './style.scss';

const defaultSrc =
  'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg';

export const Demo: React.FC = () => {
    const [image, setImage] = useState(defaultSrc);
    const [cropData, setCropData] = useState('');
    const [cropper, setCropper] = useState<any>();
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
            <div style={{ width: '100%' }}>
                <input type="file" onChange={onChange} />
                <button>Use default img</button>
                <br />
                <br />
                <Cropper
                    style={{ height: 700, width: '100%' }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
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
                    dragMode='none'
                    guides={true}
                />
            </div>
            <div className="box">
                <button onClick={onCrop}>Crop Image</button>
                <button onClick={onZoomIn}>Zoom in</button>
                <button onClick={onZoomOut}>Zoom out</button>
                <button onClick={onRotateLeft}>Rotate Left</button>
                <button onClick={onRotateRight}>Rotate Right</button>
                <button onClick={onFlipHorizontal}>Flip Horizontal</button>
                <button onClick={onFlipVertical}>Flip Vertical</button>
                <h1>
                    <span>Crop</span>
                </h1>
                <div>
                    {cropData && <img src={cropData} alt="cropped" />}
                </div>
            </div>
        </div>
    );
};

export default Demo;

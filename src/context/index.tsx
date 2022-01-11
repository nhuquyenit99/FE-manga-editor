import React, { useEffect, useState } from 'react';
import { TextBoxData } from '../model';

type ImageContextState = {
    url: string
    type: string
}

export const ImageContext = React.createContext({
    currentImage: undefined as ImageContextState|undefined,
    setCurrentImage: (fileData?: ImageContextState) => {}
});

export function ImageContextProvider ({children}: {children: React.ReactNode}) {
    const [currentImage, setCurrentImage] = useState<ImageContextState>();

    useEffect(() => {
        const image = JSON.parse(localStorage.getItem('currentImage') ?? ' {}');
        setCurrentImage(image);
    },[]);

    const updateCurrentImage = (fileData?: ImageContextState) => {
        setCurrentImage(fileData);
        if (fileData) {
            localStorage.setItem('currentImage', JSON.stringify(fileData));
        } else {
            localStorage.removeItem('currentImage');
        }
    };

    return (
        <ImageContext.Provider value={{
            currentImage: currentImage,
            setCurrentImage: updateCurrentImage
        }}>
            {children}
        </ImageContext.Provider >
    );
}

export const TextBoxContext = React.createContext({
    activeId: '',
    setActiveId: (id: string) => {},
    removeTextBox: (id: string) => {},
    textBoxs: {} as Record<string, TextBoxData>,
    setTextBoxs: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, TextBoxData>>>
});


export const EraserContext = React.createContext({
    color: 'white',
    setColor: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
    brushWidth: 10,
    setBrushWidth: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
    onUndo: () => {},
    onClearAll: () => {},
});
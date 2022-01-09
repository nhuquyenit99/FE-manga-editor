import React, { useEffect, useState } from 'react';
import { TextBoxData } from '../model';

type ImageContextType = {
    imageUrl: string
    setImageUrl: (url: string) => void
}

export const ImageContext = React.createContext<ImageContextType>({
    imageUrl: '',
    setImageUrl: () => {}
});

export function ImageContextProvider ({children}: {children: React.ReactNode}) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const imageUrl = localStorage.getItem('imageUrl');
        setImageUrl(imageUrl ?? '');
    },[]);

    const updateImageUrl = (url: string) => {
        setImageUrl(url);
        localStorage.setItem('imageUrl', url);
    };

    return (
        <ImageContext.Provider value={{
            imageUrl: imageUrl,
            setImageUrl: updateImageUrl
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
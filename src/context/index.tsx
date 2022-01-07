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

export const TextBoxActiveContext = React.createContext({
    activeId: '',
    setActiveId: (id: string) => {},
    removeTextBox: (id: string) => {}
});

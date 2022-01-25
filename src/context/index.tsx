import React, { useEffect, useState } from 'react';
import { TextBoxData } from '../model';

type ImageContextState = {
    url: string
    type: string,
    id: string,
    original_filename: string,
    created_at: string
}

export const ImageContext = React.createContext({
    currentImage: undefined as ImageContextState|undefined,
    setCurrentImage: (fileData?: ImageContextState) => {},
    activeId: '',
    setActiveId: (id: string) => {},
    removeTextBox: (id: string) => {},
    textBoxs: {} as Record<string, TextBoxData>,
    currentPage:  1,
    setCurrentPage: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
    setTextBoxs: (() => {}) as React.Dispatch<React.SetStateAction<Record<string, TextBoxData>>>,
    drawSaveData: {} as Record<number, string>,
    setDrawSaveData: (() => {}) as React.Dispatch<React.SetStateAction<Record<number, string>>>,
});

export function ImageContextProvider ({children}: {children: React.ReactNode}) {
    const [currentImage, setCurrentImage] = useState<ImageContextState>();

    const [textBoxs, setTextBoxs] = useState<Record<string, TextBoxData>>({});
    const [activeTextBox, setActiveTextBox] = useState<string>('');
    const [drawSaveData, setDrawSaveData] = useState<Record<number, string>>({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const image = JSON.parse(localStorage.getItem('currentImage') ?? ' {}');
        setCurrentImage(image);
        if (image) {
            const uploadedList = JSON.parse(localStorage.getItem('uploadedList') ?? '{}'); 
            const itemData = uploadedList?.[image.id];
            setTextBoxs(itemData?.textBoxs ?? {});
            setDrawSaveData(itemData?.drawSaveData ?? {});
        }

    },[]);

    const updateCurrentImage = (fileData?: ImageContextState) => {
        setCurrentImage(fileData);
        if (fileData) {
            localStorage.setItem('currentImage', JSON.stringify(fileData));
        } else {
            localStorage.removeItem('currentImage');
        }
    };

    const removeTextBox = (id: string) => {
        let list = {...textBoxs};
        delete list[id];
        setTextBoxs(list);
        if (activeTextBox === id) {
            setActiveTextBox('');
        }
    };

    return (
        <ImageContext.Provider value={{
            currentImage: currentImage,
            setCurrentImage: updateCurrentImage,
            activeId: activeTextBox,
            setActiveId: setActiveTextBox,
            removeTextBox: removeTextBox,
            textBoxs: textBoxs,
            currentPage: currentPage,
            setTextBoxs: setTextBoxs,
            setCurrentPage: setCurrentPage,
            drawSaveData: drawSaveData,
            setDrawSaveData: setDrawSaveData
        }}>
            {children}
        </ImageContext.Provider >
    );
}

export const EraserContext = React.createContext({
    color: 'white',
    setColor: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
    brushWidth: 10,
    setBrushWidth: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
    onUndo: () => {},
    onClearAll: () => {},
});
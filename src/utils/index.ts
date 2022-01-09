import { useState } from 'react';
import { RGBColor } from 'react-color';

export function mergeClass(...args: (string | undefined | null)[]) {
    return args.filter(Boolean).join(' ');
}

export const getRgbaFromString = (colorStr?: string) => {
    if (!colorStr) {
        return undefined;
    }
    const splittedStr = colorStr.split(',');
    return {
        r: splittedStr[0]?.slice(5),
        g: splittedStr[1],
        b: splittedStr[2],
        a: splittedStr[3]?.slice(0, splittedStr[3].length - 1)
    };
};

export const getColorStrFromRgba = (color: RGBColor) => {
    return `rgba(${color.r},${color.g},${color.b},${color.a})`;
};

export const getSizeFromPixel = (size: string) => {
    return Number.parseInt((size as string)?.slice(0,(size as string).length - 2 ));
};


export function useImageSize(url: string) {
    let img = document.createElement('img');
    img.src = url;

    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();

    img.onload = function()
    {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
    };
    return {
        canvasWidth: width,
        canvasHeight: height
    };
}
const axios = require('axios');

const CLOUD_NAME = 'doxgeaaoc';
const BASE_API = 'http://0.0.0.0:8000';

const IMAGEPost = async (data: any) => {
    return await axios({
        method: 'POST',
        url: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data: data,
        header: {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*',
        },
    });
};

type ImageData = {
    page: number,
    url: string,
    file_name: string,
    lang: string
}

const APItranslate = async (data: ImageData) => {
    return await axios({
        method: 'POST',
        url: `${BASE_API}/translate`,
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
        },
    });
};

export const DataAccess = {
    uploadImage: IMAGEPost,
    translate: APItranslate
};

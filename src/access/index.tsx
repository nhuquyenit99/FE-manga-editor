const axios = require('axios');

const CLOUD_NAME = 'doxgeaaoc';

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

export const DataAccess = {
    uploadImage: IMAGEPost
};

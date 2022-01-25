import { TextBoxData } from './text-box';

export const defaultUploadResponse = {
    'asset_id': '7505885fe2b117f0c39485f611954493',
    'public_id': 'i3bbku0qmjotesls6cfe',
    'version': 1641578471,
    'version_id': 'cc62e0e25754521293c3a28c6b263894',
    'signature': 'd7e03ce9120ec023d6a3b3c3663d22c828f611d2',
    'width': 1920,
    'height': 1080,
    'format': 'png',
    'resource_type': 'image',
    'created_at': '2022-01-07T18:01:11Z',
    'tags': [],
    'bytes': 178173,
    'type': 'upload',
    'etag': 'e87f5c68af0d2076e2e6adfb27897512',
    'placeholder': false,
    'url': 'http://res.cloudinary.com/doxgeaaoc/image/upload/v1641578471/i3bbku0qmjotesls6cfe.png',
    'secure_url': 'https://res.cloudinary.com/doxgeaaoc/image/upload/v1641578471/i3bbku0qmjotesls6cfe.png',
    'access_mode': 'public',
    'original_filename': 'Screenshot from 2021-12-31 12-37-45'
};

export type UploadResponse = typeof defaultUploadResponse;

export type FileData = {
    id: string
    url: string
    original_filename: string
    created_at: string, 
    type: string,
    textBoxs: Record<string, TextBoxData>,
    drawSaveData: Record<number, string>
}
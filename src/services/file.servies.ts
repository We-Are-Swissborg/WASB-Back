import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import isFileImage from '../utils/isFileImage';
import { lookup } from 'mime-types';


const imageConvert = async (data: Express.Multer.File | undefined, size: { x: number; y: number }) => {
    const isImage = isFileImage(data!);
    if (!isImage) throw new Error('File is not an image');

    return sharp(data?.buffer).resize(size.x, size.y).webp().toBuffer();
};

const getFileToBase64 = (filePath: string, mimetype?: string) => {
    const uploadSFolder = path.join(path.resolve('./'), filePath);
    const fileData = fs.readFileSync(uploadSFolder);
    const base64Image = fileData.toString('base64');

    let mimeType = mimetype;
    
    if (!mimeType) {
        const detectedMime = lookup(filePath);
        if (typeof detectedMime === 'string') {
            mimeType = detectedMime;
        } else {
            mimeType = 'application/octet-stream';
        }
    }
    return `data:${mimeType};base64,${base64Image}`;
};

export { imageConvert, getFileToBase64 };

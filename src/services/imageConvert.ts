import sharp from 'sharp';
import isFileImage from '../utils/isFileImage';

const imageConvert = async (data: Express.Multer.File | undefined, size: { x: number; y: number }) => {
    const isImage = isFileImage(data!);
    if (!isImage) throw new Error('File is not an image');

    return sharp(data?.buffer).resize(size.x, size.y).webp().toBuffer();
};

export default imageConvert;
